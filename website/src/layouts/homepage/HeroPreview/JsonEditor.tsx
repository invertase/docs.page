import { json } from "@codemirror/lang-json";
import { markdown } from "@codemirror/lang-markdown";
import { EditorView } from "@codemirror/view";
import CodeMirror from "@uiw/react-codemirror";
import { useMemo } from "react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  /** Remounts the editor when the open file changes (avoids stale state when switching). */
  fileKey: string;
  language?: "json" | "markdown";
  ariaLabel?: string;
};

/** `theme="none"` on `CodeMirror` so @uiw does not inject `defaultLightThemeOption` / `cm-theme-light` — this theme uses tokens and follows `html` light/dark. */
const editorTheme = EditorView.theme(
  {
    "&": {
      height: "100%",
      backgroundColor: "transparent",
      color: "hsl(var(--foreground))",
      fontSize: "12px",
      lineHeight: "1.55",
    },
    "&.cm-focused": {
      outline: "none",
    },
    ".cm-scroller": {
      fontFamily: "var(--font-mono)",
      overflow: "auto",
      padding: "0.75rem 0",
    },
    ".cm-content": {
      padding: "0",
      caretColor: "hsl(var(--primary))",
    },
    ".cm-line": {
      padding: "0 1rem",
    },
    ".cm-cursor, .cm-dropCursor": {
      borderLeftColor: "hsl(var(--primary))",
      borderLeftWidth: "1.5px",
    },
    ".cm-activeLine": {
      backgroundColor: "hsl(var(--foreground) / 0.04)",
    },
    ".cm-selectionBackground, &.cm-focused .cm-selectionBackground, ::selection":
      {
        backgroundColor: "hsl(var(--primary) / 0.18)",
      },
    ".cm-matchingBracket, .cm-nonmatchingBracket": {
      backgroundColor: "hsl(var(--primary) / 0.12)",
      outline: "1px solid hsl(var(--primary) / 0.35)",
    },
  },
  { dark: false },
);

const jsonHighlightTheme = EditorView.theme({
  ".tok-propertyName, .ͼa": {
    color: "hsl(var(--primary))",
  },
  ".tok-string, .ͼe": {
    color: "hsl(var(--marketing-success))",
  },
  ".tok-number, .ͼd": {
    color: "hsl(var(--chart-3))",
  },
  ".tok-bool, .tok-null, .ͼc": {
    color: "hsl(var(--chart-5))",
  },
  ".tok-punctuation, .ͼb": {
    color: "hsl(var(--muted-foreground))",
  },
  ".tok-comment": {
    color: "hsl(var(--muted-foreground) / 0.8)",
    fontStyle: "italic",
  },
});

export default function JsonEditor(props: Props) {
  const language = props.language ?? "json";

  const extensions = useMemo(
    () =>
      language === "json"
        ? [json(), editorTheme, jsonHighlightTheme, EditorView.lineWrapping]
        : [markdown(), editorTheme, EditorView.lineWrapping],
    [language],
  );

  return (
    <CodeMirror
      key={props.fileKey}
      theme="none"
      value={props.value}
      onChange={props.onChange}
      extensions={extensions}
      basicSetup={{
        lineNumbers: false,
        foldGutter: false,
        highlightActiveLine: true,
        highlightActiveLineGutter: false,
        bracketMatching: true,
        closeBrackets: true,
        autocompletion: false,
        searchKeymap: false,
        dropCursor: true,
        indentOnInput: true,
      }}
      indentWithTab
      aria-label={props.ariaLabel ?? "docs.json editor"}
      className="hero-preview-editor h-full w-full"
      style={{ height: "100%" }}
    />
  );
}
