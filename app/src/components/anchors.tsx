import { useActiveTab } from "@/hooks/use-active-tab";
import { useDocPageContext } from "@/hooks/use-doc-page-context";
import { useLocale } from "@/hooks/use-locale";
import { isExternalLink } from "@/lib/docs-assets";
import { Icon } from "./mdx/icon";
import { Button } from "./ui/button";

// TODO: Delete me once ready
// const anchors = [
//   {
//     icon: "github",
//     title: "GitHub",
//     href: "https://github.com/docs-page/docs-page",
//   },
//   {
//     icon: "twitter",
//     title: "Twitter",
//     href: "https://twitter.com/docs-page",
//   },
// ];

export function Anchors() {
  const ctx = useDocPageContext();
  const locale = useLocale();
  const activeTab = useActiveTab();

  const anchors =
    ctx.bundle.config.anchors
      ?.filter((anchor) => {
        return locale ? anchor.locale === locale : true;
      })
      .filter((anchor) => {
        if (anchor.tab === undefined) return true;
        if (activeTab === undefined) return true;
        return anchor.tab === activeTab;
      }) ?? [];

  if (anchors.length === 0) {
    return null;
  }

  return (
    <ul className="space-y-3 pl-2">
      {anchors.map((anchor) => {
        if (!anchor?.href) return null;

        return (
          <li key={anchor.href}>
            <Button variant="outline" size="sm" className="w-full" asChild>
              <a
                rel="noopener noreferrer"
                target={isExternalLink(anchor.href) ? "_blank" : ""}
                href={anchor.href}
              >
                <Icon
                  name={anchor.icon}
                  className="text-xs opacity-75 group-hover:opacity-100"
                />
                <span className="font-semibold">{anchor.title}</span>
              </a>
            </Button>
          </li>
        );
      })}
    </ul>
  );
}
