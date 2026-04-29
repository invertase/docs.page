export type PreviewSidebarPage = {
  title: string;
  href: string;
  icon?: string;
};

export type PreviewSidebarGroup = {
  group: string;
  pages: PreviewSidebarPage[];
};

export type PreviewConfig = {
  name: string;
  description: string;
  theme: {
    primary: string;
    primaryLight?: string;
  };
  sidebar: PreviewSidebarGroup[];
};

export const DEFAULT_CONFIG: PreviewConfig = {
  name: "foo",
  description: "Agent-ready documentation, generated from your repo.",
  theme: {
    /** Soft periwinkle 500 — aligns with `--color-soft-periwinkle-500` / brand primary. */
    primary: "#5368BD",
    primaryLight: "#6B7EC8",
  },
  sidebar: [
    {
      group: "Getting Started",
      pages: [
        { title: "Overview", href: "/", icon: "book" },
        { title: "Install", href: "/install/web", icon: "rocket" },
        { title: "Configuration", href: "/configuration", icon: "gear" },
      ],
    },
  ],
};

export const INITIAL_DOCS_JSON = `{
  "$schema": "https://docs.page/schema.json",
  "name": "foo",
  "description": "Agent-ready documentation, generated from your repo.",
  "theme": {
    "primary": "#5368BD",
    "primaryLight": "#6B7EC8"
  },
  "sidebar": [
    {
      "group": "Getting Started",
      "pages": [
        { "title": "Overview", "href": "/", "icon": "book" },
        { "title": "Install", "href": "/install/web", "icon": "rocket" },
        { "title": "Configuration", "href": "/configuration", "icon": "gear" }
      ]
    }
  ]
}
`;

function asString(value: unknown, fallback: string): string {
  return typeof value === "string" && value.length > 0 ? value : fallback;
}

function asOptionalString(value: unknown): string | undefined {
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

function normaliseSidebar(value: unknown): PreviewSidebarGroup[] {
  if (!Array.isArray(value)) {
    return DEFAULT_CONFIG.sidebar;
  }

  const groups: PreviewSidebarGroup[] = [];

  for (const entry of value) {
    if (!entry || typeof entry !== "object") continue;
    const record = entry as Record<string, unknown>;
    const groupName = asOptionalString(record.group);
    if (!groupName) continue;

    const pagesRaw = Array.isArray(record.pages) ? record.pages : [];
    const pages: PreviewSidebarPage[] = [];

    for (const page of pagesRaw) {
      if (!page || typeof page !== "object") continue;
      const pageRecord = page as Record<string, unknown>;
      const title = asOptionalString(pageRecord.title);
      const href = asOptionalString(pageRecord.href);
      if (!title || !href) continue;
      pages.push({
        title,
        href,
        icon: asOptionalString(pageRecord.icon),
      });
    }

    groups.push({ group: groupName, pages });
  }

  return groups.length > 0 ? groups : DEFAULT_CONFIG.sidebar;
}

function normaliseTheme(value: unknown): PreviewConfig["theme"] {
  if (!value || typeof value !== "object") {
    return DEFAULT_CONFIG.theme;
  }
  const record = value as Record<string, unknown>;
  return {
    primary: asString(record.primary, DEFAULT_CONFIG.theme.primary),
    primaryLight: asOptionalString(record.primaryLight),
  };
}

export function normaliseConfig(value: unknown): PreviewConfig {
  if (!value || typeof value !== "object") {
    return DEFAULT_CONFIG;
  }
  const record = value as Record<string, unknown>;
  return {
    name: asString(record.name, DEFAULT_CONFIG.name),
    description: asString(record.description, DEFAULT_CONFIG.description),
    theme: normaliseTheme(record.theme),
    sidebar: normaliseSidebar(record.sidebar),
  };
}

export type ParseResult = {
  config: PreviewConfig | null;
  error: string | null;
};

export function safeParse(text: string): ParseResult {
  try {
    const parsed = JSON.parse(text);
    return { config: normaliseConfig(parsed), error: null };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Invalid JSON syntax";
    return { config: null, error: message };
  }
}
