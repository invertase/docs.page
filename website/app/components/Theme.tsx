import { Switch } from "@headlessui/react";
import Color from "color";
import { MoonIcon, SunDimIcon } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { type Context, usePageContext } from "~/context";
import { cn } from "~/utils";

function getThemeKey(context: Context) {
  return context.preview
    ? "preview:theme"
    : `docs.page:theme:${context.owner}/${context.repository}`;
}

export function ThemeScripts() {
  const container = useRef<HTMLDivElement>(null);
  const context = usePageContext();
  const key = getThemeKey(context);
  const theme = context.bundle.config.theme;

  const fallback = "#00bcd4";

  const getColor = (color: string, fallback?: string) => {
    try {
      return Color(color);
    } catch {
      return Color(fallback);
    }
  };

  const defaultTheme = theme?.defaultTheme ?? "system";
  const primaryLight = getColor(
    theme?.primaryLight ?? theme?.primary ?? fallback
  );
  const primaryDark = getColor(
    theme?.primaryDark ?? theme?.primary ?? fallback
  );
  const backgroundLight = getColor(theme?.backgroundLight ?? "#F9FAFB");
  const backgroundDark = getColor(theme?.backgroundDark ?? "#0B0D0E");

  function toHslVariable(color: Color) {
    const [h, s, l] = color.hsl().array();
    return `${h} ${s.toFixed(2)}% ${l.toFixed(2)}%`;
  }

  const scripts = `
    <script>
      (() => {
        const defaultTheme = '${defaultTheme}';
        const key = '${key}';
        if (key in localStorage) {
          document.documentElement.setAttribute('data-theme', localStorage[key]);
        } else {
          if (defaultTheme === 'system') {
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
              document.documentElement.setAttribute('data-theme', 'dark');
            } else {
              document.documentElement.setAttribute('data-theme', 'light');
            }
          } else {
            document.documentElement.setAttribute('data-theme', defaultTheme);
          }
        }
      })();
    </script>
    <script>
      (() => {
        const root = document.documentElement;
        root.style.setProperty('--primary-light', '${toHslVariable(
          primaryLight
        )}');
				root.style.setProperty('--primary-light-lighter', '${toHslVariable(
          primaryLight.lighten(0.2)
        )}');
        root.style.setProperty('--primary-dark', '${toHslVariable(
          primaryDark
        )}');
				root.style.setProperty('--primary-dark-lighter', '${toHslVariable(
          primaryDark.lighten(0.5)
        )}');
        root.style.setProperty('--background-light', '${toHslVariable(
          backgroundLight
        )}');
        root.style.setProperty('--background-dark', '${toHslVariable(
          backgroundDark
        )}');
      })();
    </script>
  `;

  useLayoutEffect(() => {
    if (container.current) {
      container.current.innerHTML = "";
      const range = document.createRange();
      range.selectNode(container.current);
      const fragment = range.createContextualFragment(scripts);
      container.current!.appendChild(fragment);
    }
  }, [scripts]);

  return <div ref={container} dangerouslySetInnerHTML={{ __html: scripts }} />;
}

export function ThemeToggle() {
  const ctx = usePageContext();
  const key = getThemeKey(ctx);
  const [enabled, setEnabled] = useState<boolean>();

  useLayoutEffect(() => {
    const isDark =
      document.documentElement.getAttribute("data-theme") === "dark";
    setEnabled(isDark);
  }, []);

  useEffect(() => {
    if (enabled !== undefined) {
      const theme = enabled ? "dark" : "light";
      localStorage[key] = theme;
      document.documentElement.setAttribute("data-theme", theme);
    }
  }, [key, enabled]);

  if (ctx.bundle.config.header?.showThemeToggle === false) {
    return null;
  }

  if (enabled === undefined) {
    return <div className="h-3 w-7" />;
  }

  return (
    <Switch
      checked={enabled}
      onChange={setEnabled}
      className={cn(
        "relative inline-flex h-3 w-7 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200/60 transition-colors duration-200 ease-in-out dark:bg-white/10"
      )}
    >
      <span className="sr-only">Toggle theme</span>
      <span
        className={cn(
          "pointer-events-none relative -top-1.5 inline-block h-5 w-5 transform rounded-full border shadow ring-0 transition duration-200 ease-in-out",
          {
            "border-primary translate-x-3 bg-black": enabled,
            "-translate-x-2 bg-white": !enabled,
          }
        )}
      >
        <span
          className={cn(
            enabled
              ? "opacity-0 duration-100 ease-out"
              : "opacity-100 duration-200 ease-in",
            "absolute inset-0 flex h-full w-full items-center justify-center transition-opacity"
          )}
          aria-hidden="true"
        >
          <SunDimIcon className="h-4 w-4 text-yellow-500" />
        </span>
        <span
          className={cn(
            enabled
              ? "opacity-100 duration-200 ease-in"
              : "opacity-0 duration-100 ease-out",
            "absolute inset-0 flex h-full w-full items-center justify-center transition-opacity"
          )}
          aria-hidden="true"
        >
          <MoonIcon className="text-primary h-3 w-3" />
        </span>
      </span>
    </Switch>
  );
}
