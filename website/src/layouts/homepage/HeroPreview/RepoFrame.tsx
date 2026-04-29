import {
  Braces,
  ChevronRight,
  FileCode2,
  FileText,
  FilePlus2,
  Folder,
  GitBranch,
  Search,
} from "lucide-react";
import dynamic from "next/dynamic";

import { cn } from "~/lib/utils";

import {
  type RepoFileKey,
  editorLanguageForFile,
  tabTagForFile,
  tabTitleForFile,
} from "./repoFileExamples";

const JsonEditor = dynamic(() => import("./JsonEditor"), {
  ssr: false,
  loading: () => <EditorFallback />,
});

type Props = {
  activeFile: RepoFileKey;
  onSelectFile: (file: RepoFileKey) => void;
  content: string;
  onContentChange: (value: string) => void;
  /** JSON error badge in window chrome; null when a non-JSON file is open. */
  parseError: string | null;
};

type FileType = "json" | "mdx" | "md";

type TreeFile = {
  kind: "file";
  name: string;
  path: RepoFileKey;
  fileType: FileType;
  modified?: boolean;
};

type TreeFolder = {
  kind: "folder";
  name: string;
  children: TreeNode[];
  defaultOpen?: boolean;
  /** Cyan/blue “dirty” folder dot (e.g. uncommitted changes) */
  statusDot?: boolean;
};

type TreeNode = TreeFile | TreeFolder;

const TREE: TreeNode[] = [
  {
    kind: "folder",
    name: "docs",
    defaultOpen: true,
    statusDot: true,
    children: [
      {
        kind: "folder",
        name: "install",
        defaultOpen: true,
        children: [
          {
            kind: "file",
            name: "web.mdx",
            path: "docs/install/web.mdx",
            fileType: "mdx",
            modified: true,
          },
        ],
      },
      {
        kind: "file",
        name: "index.mdx",
        path: "docs/index.mdx",
        fileType: "mdx",
      },
    ],
  },
  {
    kind: "file",
    name: "docs.json",
    path: "docs.json",
    fileType: "json",
    modified: true,
  },
  {
    kind: "file",
    name: "README.md",
    path: "README.md",
    fileType: "md",
    modified: true,
  },
];

export function RepoFrame(props: Props) {
  return (
    <div
      className={cn(
        "flex h-full min-h-0 flex-col",
        "bg-card text-card-foreground",
        "dark:bg-marketing-platform-inner-dark",
      )}
    >
      <Chrome parseError={props.parseError} />
      <div className="grid min-h-0 flex-1 grid-cols-1 sm:grid-cols-[minmax(0,12rem)_1fr] sm:min-h-0 md:grid-cols-[minmax(0,13rem)_1fr]">
        <FileExplorerColumn
          activeFile={props.activeFile}
          onSelectFile={props.onSelectFile}
        />
        <div
          className={cn(
            "relative min-h-0",
            "border-t border-border sm:border-t-0",
            "sm:border-l sm:border-border dark:sm:border-l-zinc-800/80",
          )}
        >
          <div className="flex h-9 items-center justify-between border-b border-border bg-muted/40 px-3 font-mono text-[11px] text-muted-foreground">
            <span className="truncate" title={props.activeFile}>
              {tabTitleForFile(props.activeFile)}
            </span>
            <span className="hidden text-[10px] uppercase tracking-wider text-muted-foreground/70 sm:inline">
              {tabTagForFile(props.activeFile)}
            </span>
          </div>
          <div className="absolute inset-x-0 bottom-0 top-9 overflow-hidden">
            <JsonEditor
              fileKey={props.activeFile}
              value={props.content}
              onChange={props.onContentChange}
              language={editorLanguageForFile(props.activeFile)}
              ariaLabel={`${tabTitleForFile(props.activeFile)} source`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Chrome({ parseError }: { parseError: string | null }) {
  return (
    <div className="flex h-9 shrink-0 items-center gap-3 border-b border-border bg-muted/30 px-3">
      <div className="flex items-center gap-1.5" aria-hidden>
        <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57] shadow-[0_0_0_0.5px_hsl(0_0%_0%/0.2)]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E] shadow-[0_0_0_0.5px_hsl(0_0%_0%/0.15)]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28C840] shadow-[0_0_0_0.5px_hsl(0_0%_0%/0.15)]" />
      </div>
      <div className="flex flex-1 items-center justify-center">
        <div
          className="inline-flex items-center gap-1.5 px-2.5 py-1 font-sans text-[11px] text-muted-foreground"
        >
          <i aria-hidden className="fa-brands fa-github text-[12px] shrink-0" />
          <span className="whitespace-nowrap text-foreground/80">invertase/foo</span>
        </div>
      </div>
      <div className="flex w-[3.5rem] justify-end">
        {parseError ? (
          <span
            title={parseError}
            className="inline-flex items-center gap-1 rounded-full border border-destructive/40 bg-destructive/10 px-2 py-0.5 text-[10px] font-medium text-destructive"
          >
            <span aria-hidden>!</span>
            <span>JSON</span>
          </span>
        ) : null}
      </div>
    </div>
  );
}

function FileExplorerColumn({
  activeFile,
  onSelectFile,
}: {
  activeFile: RepoFileKey;
  onSelectFile: (f: RepoFileKey) => void;
}) {
  return (
    <div
      className={cn(
        "hidden min-h-0 w-full min-w-0 flex-col sm:flex",
        "border-b border-border sm:border-b-0 dark:border-zinc-800/80",
        "bg-card text-foreground dark:bg-zinc-950 dark:text-zinc-300",
      )}
    >
      <ExplorerHeader />
      <FileTree activeFile={activeFile} onSelectFile={onSelectFile} />
    </div>
  );
}

function ExplorerHeader() {
  return (
    <div
      className={cn(
        "flex h-9 min-h-9 shrink-0 items-center justify-between gap-1.5 pl-1.5 pr-1",
        "border-b border-border bg-muted/40 dark:border-zinc-800/60 dark:bg-transparent",
        "text-muted-foreground",
      )}
    >
      <span
        className="min-w-0 flex-1 truncate pl-0.5 text-left font-sans text-[11px] font-medium tracking-tight text-foreground"
        title="invertase/foo"
      >
        invertase/foo
      </span>
      <div
        className="flex flex-none items-center gap-0.5"
        aria-hidden
        role="presentation"
      >
        {[
          { key: "search", el: <Search className="h-3.5 w-3.5" /> },
          { key: "new file", el: <FilePlus2 className="h-3.5 w-3.5" /> },
          { key: "branch", el: <GitBranch className="h-3.5 w-3.5" /> },
        ].map((item) => (
          <span
            key={item.key}
            className="rounded p-0.5 text-muted-foreground"
            // Decorative mock toolbar — visual parity with VS Code, no actions
            tabIndex={-1}
          >
            {item.el}
          </span>
        ))}
      </div>
    </div>
  );
}

function FileTree({
  activeFile,
  onSelectFile,
}: {
  activeFile: RepoFileKey;
  onSelectFile: (f: RepoFileKey) => void;
}) {
  return (
    <nav
      aria-label="Repository files"
      className={cn(
        "min-h-0 w-full min-w-0 flex-1 overflow-y-auto py-1.5 [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5",
        "[scrollbar-color:hsl(var(--color-zinc-400))_transparent] dark:[scrollbar-color:hsl(var(--color-zinc-600))_transparent]",
      )}
    >
      <ul className="w-full list-none p-0 font-sans text-[12px] leading-tight text-foreground dark:text-zinc-300">
        {TREE.map((node, index) => (
          <TreeItem
            key={`${node.kind}-${index}-${"name" in node ? node.name : ""}`}
            node={node}
            depth={0}
            activeFile={activeFile}
            onSelectFile={onSelectFile}
          />
        ))}
      </ul>
    </nav>
  );
}

function TreeItem({
  node,
  depth,
  activeFile,
  onSelectFile,
}: {
  node: TreeNode;
  depth: number;
  activeFile: RepoFileKey;
  onSelectFile: (f: RepoFileKey) => void;
}) {
  const gutter = 10 + depth * 10;

  if (node.kind === "folder") {
    return (
      <li className="w-full min-w-0 list-none">
        <div
          className={cn(
            "group/folder flex w-full min-w-0 min-h-[22px] items-center gap-0.5",
            "py-0.5 pl-0.5 pr-1.5",
            "rounded-sm",
            "text-foreground dark:text-zinc-300",
            "hover:bg-muted/60 dark:hover:bg-white/5",
          )}
          style={{ paddingLeft: `${gutter}px` }}
        >
          <span className="flex w-full min-w-0 items-center gap-0.5">
            <ChevronRight
              strokeWidth={2.25}
              className={cn("size-2.5 shrink-0 text-muted-foreground", {
                "rotate-90": node.defaultOpen,
              })}
            />
            <Folder className="size-3 shrink-0 text-[hsl(var(--color-brand-teal)/0.9)] dark:text-[hsl(var(--color-brand-teal)/0.82)]" strokeWidth={1.5} />
            <span className="min-w-0 flex-1 truncate pr-0.5 text-foreground dark:text-zinc-300">
              {node.name}
            </span>
            {node.statusDot ? (
              <span
                className="h-1.5 w-1.5 shrink-0 rounded-full bg-[hsl(var(--color-brand-teal)/0.88)] dark:bg-[hsl(var(--color-brand-teal)/0.78)]"
                title="Contains changes"
                aria-hidden
              />
            ) : null}
          </span>
        </div>
        {node.defaultOpen ? (
          <ul className="w-full list-none p-0">
            {node.children.map((child, index) => (
              <TreeItem
                key={`${index}-${"name" in child ? child.name : "?"}`}
                node={child}
                depth={depth + 1}
                activeFile={activeFile}
                onSelectFile={onSelectFile}
              />
            ))}
          </ul>
        ) : null}
      </li>
    );
  }

  return (
    <FileRow
      node={node}
      depth={depth}
      gutter={gutter}
      isActive={activeFile === node.path}
      onSelectFile={onSelectFile}
    />
  );
}

function FileTypeGlyph({ t }: { t: FileType }) {
  if (t === "json") {
    return (
      <Braces
        className="size-3 shrink-0 text-[hsl(var(--color-brand-warm-orange)/0.92)] dark:text-[hsl(var(--color-brand-warm-orange)/0.88)]"
        strokeWidth={1.5}
        aria-hidden
      />
    );
  }
  if (t === "mdx") {
    return (
      <FileCode2
        className="size-3 shrink-0 text-[hsl(var(--color-brand-lavender)/0.9)] dark:text-[hsl(var(--color-brand-lavender)/0.84)]"
        strokeWidth={1.5}
        aria-hidden
      />
    );
  }
  return (
    <FileText
      className="size-3 shrink-0 text-[hsl(var(--color-brand-teal)/0.82)] dark:text-[hsl(var(--color-brand-teal)/0.78)]"
      strokeWidth={1.5}
      aria-hidden
    />
  );
}

function FileRow({
  node,
  depth: _depth,
  gutter,
  isActive,
  onSelectFile,
}: {
  node: TreeFile;
  depth: number;
  gutter: number;
  isActive: boolean;
  onSelectFile: (f: RepoFileKey) => void;
}) {
  return (
    <li className="w-full min-w-0 list-none">
      <button
        type="button"
        className={cn(
          "flex w-full min-w-0 items-center gap-1.5",
          "m-0 p-0 text-left",
          "py-0.5 pl-0.5 pr-1.5",
          "cursor-pointer select-none font-sans",
          isActive
            ? cn(
                "border-y border-border dark:border-zinc-600/45",
                "bg-muted dark:bg-zinc-800/85",
                "text-foreground dark:text-zinc-100",
                "rounded-none",
              )
            : cn(
                "border-0",
                "rounded-sm",
                "text-foreground dark:text-zinc-300",
                "hover:bg-muted/60 dark:hover:bg-white/5",
              ),
        )}
        style={{ paddingLeft: `${gutter}px` }}
        onClick={() => onSelectFile(node.path)}
        aria-current={isActive ? "page" : undefined}
        aria-label={`Open file ${node.path}`}
      >
        <span className="inline-block w-2 shrink-0" />
        <FileTypeGlyph t={node.fileType} />
        <span
          className={cn(
            "min-w-0 flex-1 truncate",
            isActive && "text-foreground dark:text-zinc-100",
          )}
        >
          {node.name}
        </span>
        {node.modified ? (
          <span
            className={cn(
              "shrink-0 pr-0.5 font-mono text-[9px] font-medium leading-none",
              isActive
                ? "text-muted-foreground dark:text-zinc-500"
                : "text-[hsl(var(--color-brand-coral-red)/0.95)] dark:text-[hsl(var(--color-brand-coral-red)/0.88)]",
            )}
            title="Modified in working tree"
            aria-hidden
          >
            M
          </span>
        ) : null}
      </button>
    </li>
  );
}

function EditorFallback() {
  return (
    <pre className="h-full w-full overflow-auto bg-transparent px-4 py-3 font-mono text-[12px] leading-relaxed text-muted-foreground">
      Loading editor…
    </pre>
  );
}
