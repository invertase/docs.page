import { useActiveTab } from "@/hooks/use-active-tab";
import { useDocPageContext } from "@/hooks/use-doc-page-context";
import { useLocale } from "@/hooks/use-locale";
import { Icon } from "./mdx/icon";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Link } from "./doc-link";


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
    <>
      <ul className="space-y-3 pl-2">
        {anchors.map((anchor) => {
          if (!anchor?.href) return null;

          return (
            <li key={anchor.href}>
              <Link href={anchor.href} className="flex items-center gap-2">
                <Button variant="outline" size="icon-sm">
                  <Icon name={anchor.icon} />
                </Button>
                <span className="text-sm">{anchor.title}</span>
              </Link>
            </li>
          );
        })}
      </ul>
      <Separator className="my-4" />
    </>
  );
}
