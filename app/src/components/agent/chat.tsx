import {
  type FormEvent,
  type KeyboardEvent,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { DefaultChatTransport } from "ai";
import { useChat } from "@ai-sdk/react";
import Cookies from "js-cookie";
import { Streamdown } from "streamdown";
import { code } from "@streamdown/code";

import {
  RiArrowRightSLine,
  RiArrowUpLine,
  RiLoaderLine,
  RiSparkling2Line,
  RiStopLine,
  RiToolsLine,
} from "@remixicon/react";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { useDocPageContext } from "@/hooks/use-doc-page-context";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { Link } from "../doc-link";
import { Kbd } from "../ui/kbd";

const AGENT_CSRF_COOKIE_NAME = "agent_session_csrf";
const AGENT_SESSION_HEADER_NAME = "X-Agent-Session";
const MAX_INPUT_LENGTH = 1000;

export function AgentChat({ setOpen }: { setOpen?: (open: boolean) => void }) {
  const { meta, kind, bundle } = useDocPageContext();
  const [input, setInput] = useState("");
  const messagesScrollRef = useRef<HTMLDivElement>(null);
  const agentAvailable = kind === "doc" && meta.hasAgent;
  const questions = bundle.config.agent?.questions ?? [];

  const { messages, sendMessage, status, error, stop } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/agent",
      credentials: "include",
      headers: (): Record<string, string> => {
        const csrfToken = Cookies.get(AGENT_CSRF_COOKIE_NAME);

        if (!csrfToken) {
          return {};
        }

        return { [AGENT_SESSION_HEADER_NAME]: csrfToken };
      },
    }),
  });

  const hasSent = status === "submitted" || status === "streaming";
  const showQuestions = messages.length === 0 && agentAvailable;
  const awaitingReply =
    hasSent && messages.length > 0 && messages.at(-1)?.role === "user";
  const errorMessage = error?.message ?? null;

  const submitText = useCallback(
    (text: string) => {
      const trimmed = text.trim().slice(0, MAX_INPUT_LENGTH);

      if (!agentAvailable || hasSent || !trimmed) {
        return;
      }

      sendMessage({ text: trimmed });
      setInput("");
    },
    [agentAvailable, hasSent, sendMessage],
  );

  useLayoutEffect(() => {
    if (showQuestions) {
      return;
    }

    const container = messagesScrollRef.current;
    if (!container) {
      return;
    }

    container.scrollTop = container.scrollHeight;
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitText(input);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submitText(input);
    }
  };

  return (
    <div className="flex h-full min-h-0 w-full min-w-0 flex-col">
      <div className="flex h-12 shrink-0 items-center px-4">
        <h2 className="flex flex-1 items-center gap-2 text-sm font-medium">
          <RiSparkling2Line className="size-4" />
          <span>Agent</span>
        </h2>
        {setOpen && (
          <div>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <RiArrowRightSLine />
            </Button>
          </div>
        )}
      </div>

      <div
        ref={messagesScrollRef}
        className={cn(
          "min-h-0 flex-1 px-4 py-3",
          showQuestions
            ? "flex flex-col overflow-hidden"
            : "min-w-0 space-y-5 overflow-y-auto overscroll-y-contain",
        )}
      >
        {showQuestions ? (
          <div className="mt-auto flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              Tip: You can open and close chat with <Kbd>Ctrl</Kbd>+<Kbd>I</Kbd>
            </p>
            {questions.length > 0 && (
              <ul className="flex flex-col items-start gap-0.5">
                {questions.map((question) => (
                  <li key={question} className="w-full">
                    <Button
                      type="button"
                      variant="link"
                      className="h-auto w-full justify-start px-0 py-1.5 text-left font-normal whitespace-normal"
                      disabled={hasSent}
                      onClick={() => submitText(question)}
                    >
                      {question}
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <>
            {messages.map((message) => {
              if (message.role === "user") {
                return (
                  <div key={message.id} className="flex w-full justify-end">
                    <span className="max-w-[85%] rounded-2xl bg-secondary px-3 py-2 text-sm text-secondary-foreground">
                      {message.parts
                        .filter((p) => p.type === "text")
                        .map((p) => p.text)
                        .join("")}
                    </span>
                  </div>
                );
              }

              if (message.role === "assistant") {
                const bashCalls = message.parts.flatMap((part) => {
                  if (part.type !== "tool-bash") {
                    return [];
                  }

                  const command = getBashCommand(part.input);
                  const result = getBashExitCode(part.output) ?? 0;

                  if (!command) {
                    return [];
                  }

                  return [{ command, result }];
                });
                return (
                  <div key={message.id} className="min-w-0 space-y-2">
                    <BashCalls calls={bashCalls} />
                    <div className="flex min-w-0 w-full justify-start">
                      <div className="min-w-0 max-w-full flex-1 text-sm">
                        {message.parts.map((part, index) =>
                          part.type === "text" ? (
                            <Streamdown
                              key={index}
                              className="agent-chat-markdown text-sm"
                              isAnimating={status === "streaming"}
                              controls={{ code: { download: false } }}
                              plugins={{
                                code,
                              }}
                              linkSafety={{ enabled: false }}
                              components={{
                                a: (props) => (
                                  <Link
                                    href={props.href ?? "/"}
                                    className="underline decoration-primary underline-offset-4 hover:opacity-80 transition-opacity"
                                  >
                                    {props.children}
                                  </Link>
                                ),
                              }}
                            >
                              {part.text}
                            </Streamdown>
                          ) : null,
                        )}
                      </div>
                    </div>
                  </div>
                );
              }

              return null;
            })}

            {awaitingReply && (
              <div
                className="flex items-center gap-2 text-sm text-muted-foreground"
                aria-live="polite"
              >
                <RiLoaderLine className="size-4 animate-spin" />
                <span>Thinking…</span>
              </div>
            )}
          </>
        )}
      </div>

      <form className="shrink-0 space-y-2 p-3" onSubmit={handleSubmit}>
        {errorMessage && (
          <p className="text-sm text-destructive" role="alert">
            {errorMessage}
          </p>
        )}
        <InputGroup className="h-auto bg-input/30 shadow-none transition-none">
          <InputGroupTextarea
            className="max-h-30 min-h-16 bg-transparent transition-none dark:bg-transparent"
            placeholder={
              agentAvailable
                ? (bundle.config.agent?.placeholder ?? "Ask a question...")
                : "Agent unavailable for this page"
            }
            value={input}
            maxLength={MAX_INPUT_LENGTH}
            onChange={(event) =>
              setInput(event.target.value.slice(0, MAX_INPUT_LENGTH))
            }
            onKeyDown={handleKeyDown}
            disabled={!agentAvailable}
            rows={1}
          />
          <InputGroupAddon align="block-end" className="justify-between gap-2">
            {agentAvailable && (
              <span className="text-[10px] text-muted-foreground">
                Shift + Enter for new line
              </span>
            )}
            <Button
              size="icon"
              type={hasSent ? "button" : "submit"}
              className={cn(!agentAvailable && "ml-auto")}
              onClick={hasSent ? () => stop() : undefined}
              disabled={
                !agentAvailable || (!hasSent && input.trim().length === 0)
              }
              title={hasSent ? "Stop generating" : "Send message"}
            >
              {status === "submitted" ? (
                <RiLoaderLine className="animate-spin" />
              ) : status === "streaming" ? (
                <RiStopLine />
              ) : (
                <RiArrowUpLine />
              )}
            </Button>
          </InputGroupAddon>
        </InputGroup>
      </form>
    </div>
  );
}

function BashCalls({
  calls,
}: {
  calls: { command: string; result: number }[];
}) {
  const [expanded, setExpanded] = useState(false);

  if (!calls.length) {
    return null;
  }

  return (
    <Collapsible
      open={expanded}
      onOpenChange={setExpanded}
      className="flex w-full min-w-0 max-w-full flex-col gap-2"
    >
      <div className="flex items-center justify-between gap-4">
        <CollapsibleTrigger asChild>
          <Button
            variant="link"
            size="xs"
            className="-ml-2 text-muted-foreground hover:no-underline"
          >
            <RiToolsLine />
            <span>
              {expanded ? "Hide" : "Show"} {calls.length} tool calls
            </span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="flex flex-col gap-1 text-[10px] text-muted-foreground">
        {calls.map((call, index) => (
          <div
            key={`${call.command}-${index}`}
            className="flex items-center gap-2"
          >
            <code className="font-mono">{call.command}</code>
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getBashCommand(input: unknown): string | null {
  if (!isRecord(input)) {
    return null;
  }

  const command = input.command;
  return typeof command === "string" && command.length > 0 ? command : null;
}

function getBashExitCode(output: unknown): number | null {
  if (!isRecord(output)) {
    return null;
  }

  const exitCode = output.exitCode;
  return typeof exitCode === "number" ? exitCode : null;
}
