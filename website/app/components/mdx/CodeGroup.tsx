import { CheckIcon, CopyIcon } from "lucide-react";
import {
  Children,
  type ComponentProps,
  createContext,
  isValidElement,
  useContext,
  useEffect,
  useState,
} from "react";
import type { Context } from "~/context";
import { cn } from "~/utils";

// Used to get the key for the local storage for the selected tab group.
function getCodeGroupKey(context: Context, value: string) {
  return context.preview
    ? `preview:code-group:${value}`
    : `docs.page:code-group:${context.owner}/${context.repository}:${value}`;
}

const CodeGroupContext = createContext<
  | {
      language?: string;
      onChange: (language: string) => void;
    }
  | undefined
>(undefined);

// Provider for the tabs context, which keeps track of the selected syncronized code group.
export function CodeGroupProvider(props: ComponentProps<"div">) {
  const [language, setLanguage] = useState<string>();

  return (
    <CodeGroupContext.Provider value={{ language, onChange: setLanguage }}>
      <div {...props} />
    </CodeGroupContext.Provider>
  );
}

function useCodeGroups() {
  const context = useContext(CodeGroupContext);

  if (!context) {
    throw new Error("useCodeGroups must be used within a CodeGroupProvider");
  }

  return context;
}

type CodeGroupProps = ComponentProps<"div"> & {
  title?: string;
  defaultLanguage?: string;
  synchronize?: boolean;
};

export function CodeGroup(props: CodeGroupProps) {
  const codeGroups = useCodeGroups();
  const [copied, setCopied] = useState(false);

  // Iterate each child to make sure its a code block from the bundler.
  const groups =
    Children.map(props.children, (child) => {
      // Only render children that are code blocks.
      if (
        !child ||
        !isValidElement(child) ||
        !child.props?.html?.startsWith("<pre")
      ) {
        return null;
      }

      return child;
    })?.filter(Boolean) ?? [];

  function onCopy(text: string) {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // Get the languages from the code block props.
  const languages = groups.map((group) =>
    String(group.props.language || "text")
  );

  let defaultLanguage: string;

  if (
    props.synchronize &&
    codeGroups.language &&
    languages.includes(codeGroups.language)
  ) {
    defaultLanguage = codeGroups.language;
  } else {
    defaultLanguage = props.defaultLanguage
      ? languages.includes(props.defaultLanguage)
        ? props.defaultLanguage
        : languages[0]
      : languages[0];
  }

  // Keep track of the active language.
  const [active, setActive] = useState(defaultLanguage);

	// Sync the active language with the code group context.
  useEffect(() => {
    if (
      props.synchronize &&
      codeGroups.language &&
      languages.includes(codeGroups.language) &&
      active !== codeGroups.language
    ) {
      setActive(codeGroups.language);
    }
  }, [active, props.synchronize, codeGroups.language, languages]);

  // Find the code block that matches the active language and get the raw code.
  const copy = groups.find((group) => group.props.language === active)?.props
    .raw;

  return (
    <div className="not-prose relative group border border-black/10 dark:border-white/10 rounded-md shadow-sm overflow-hidden mb-5">
      <div className="h-10 flex items-center bg-black text-xs border-b border-white/20 font-bold">
        {!!props.title && (
          <div className="grow">
            <div className="relative h-10 text-primary top-px inline-flex items-center px-4 border-b border-primary">
              {props.title}
            </div>
          </div>
        )}
        <div className="flex items-center px-3  ">
          {languages.map((language) => (
            <button
              type="button"
              key={language}
              className={cn(
                "text-white/70 hover:bg-white/10 px-2 py-1.5 rounded-md",
                {
                  "text-primary": language === active,
                }
              )}
              onClick={() => {
                setActive(language);

                if (props.synchronize) {
                  codeGroups.onChange(language);
                }
              }}
            >
              {language}
            </button>
          ))}
        </div>
      </div>
      {!!copy && (
        <button
          type="button"
          className={cn(
            "size-5 absolute right-4 z-10 text-white opacity-50 hover:opacity-75",
            {
              "top-14": !!props.title,
              "top-2.5": !props.title,
            }
          )}
          onClick={() => onCopy(copy)}
        >
          {copied ? <CheckIcon size={18} /> : <CopyIcon size={18} />}
        </button>
      )}
      <div>
        {groups.map((group) => {
          return (
            <div
              key={group.key}
              dangerouslySetInnerHTML={{ __html: group.props.html }}
              className={cn(
                "[&>pre]:p-4 [&>pre]:overflow-x-auto text-sm leading-6",
                {
                  hidden: group.props.language !== active,
                }
              )}
            />
          );
        })}
      </div>
    </div>
  );
}
