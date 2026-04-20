import { type FormEvent, Fragment, useMemo, useState } from "react";
import { DefaultChatTransport } from "ai";
import { useChat } from "@ai-sdk/react";
import Cookies from "js-cookie";
import {
  RiArrowRightSLine,
  RiChatAiLine,
  RiSparkling2Line,
  RiToolsLine,
} from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useDocPageContext } from "@/hooks/use-doc-page-context";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const AGENT_CSRF_COOKIE_NAME = "agent_session_csrf";
const AGENT_SESSION_HEADER_NAME = "X-Agent-Session";

export function AgentChat({ setOpen }: { setOpen?: (open: boolean) => void }) {
  const { hasAgent, kind } = useDocPageContext();
  const [input, setInput] = useState("");
  const agentAvailable = kind === "doc" && hasAgent;

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

  const isSending = status === "submitted" || status === "streaming";
  const errorMessage = error?.message ?? null;
  const availabilityMessage = useMemo(() => {
    if (agentAvailable) {
      return "Your conversation will appear here.";
    }

    if (kind === "debug") {
      return "The agent is unavailable on debug pages.";
    }

    return "This repository does not have an enabled agent.";
  }, [agentAvailable, kind]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!agentAvailable || isSending) {
      return;
    }

    const text = input.trim();

    if (!text) {
      return;
    }

    sendMessage({ text });
    setInput("");
  };

  const streamingStatus = useMemo(() => {
    if (!isSending) {
      return null;
    }

    return status === "submitted"
      ? "Agent is thinking..."
      : "Agent is streaming...";
  }, [isSending, status]);
  const visibleMessages = useMemo(() => {
    return messages
      .map((message) => ({
        ...message,
        content: message.parts
          .filter((part) => part.type === "text")
          .map((part) => part.text)
          .join("")
          .trim(),
      }))
      .filter((message) => message.content.length > 0);
  }, [messages]);

  return (
    <div className="flex h-full min-h-0 w-full min-w-0 flex-col">
      <div className="flex h-12 shrink-0 items-center px-4">
        <h2 className="flex-1 text-sm font-medium flex items-center gap-2">
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

      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-4 py-3">
        {messages.map((message) => {
          if (message.role === "user") {
            return (
              <div key={message.id} className="flex w-full justify-end">
                <span className="max-w-[85%] rounded-2xl bg-secondary text-secondary-foreground px-3 py-2 text-sm">
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
              <div key={message.id} className="space-y-2">
                <BashCalls calls={bashCalls} />
                <div key={message.id} className="flex w-full justify-start">
                  <span className="rounded-2xl text-sm">
                    {message.parts
                      .filter((p) => p.type === "text")
                      .map((p) => p.text)
                      .join("")}
                  </span>
                </div>
              </div>
            );
          }

          return null;
        })}
      </div>

      <form className="shrink-0 p-3" onSubmit={handleSubmit}>
        <div className="relative">
          <Textarea
            className="pr-14 h-30"
            placeholder={
              agentAvailable
                ? "Ask a question..."
                : "Agent unavailable for this page"
            }
            value={input}
            onChange={(event) => setInput(event.target.value)}
            disabled={!agentAvailable || isSending}
          />
          <Button
            className="absolute right-2 bottom-2"
            size="icon-sm"
            type={isSending ? "button" : "submit"}
            onClick={isSending ? () => stop() : undefined}
            disabled={
              !agentAvailable || (!isSending && input.trim().length === 0)
            }
            title={isSending ? "Stop generating" : "Send message"}
          >
            <RiChatAiLine />
          </Button>
        </div>
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
      className="flex w-[350px] flex-col gap-2"
    >
      <div className="flex items-center justify-between gap-4">
        <CollapsibleTrigger asChild>
          <Button variant="link" size="xs" className="-ml-2 hover:no-underline text-muted-foreground">
            <RiToolsLine />
            <span>{expanded ? "Hide" : "Show"} {calls.length} tool calls</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="flex flex-col gap-1 text-[10px] text-muted-foreground">
        {calls.map((call) => (
          <div key={call.command} className="flex items-center gap-2">
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
