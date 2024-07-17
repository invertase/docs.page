import { useActiveTab, useLocale, usePageContext } from "~/context";
import { isExternalLink } from "~/utils";
import { Icon } from "./Icon";

export function Anchors() {
	const ctx = usePageContext();
	const locale = useLocale();
	const activeTab = useActiveTab();

	const anchors =
		ctx.bundle.config.anchors
			?.filter((anchor) => {
				return locale ? anchor.locale === locale : true;
			})
			.filter((anchor) => {
				if (activeTab === undefined) return true;
				return anchor.tab === activeTab;
			}) ?? [];

	if (!anchors.length) {
		return null;
	}

	return (
		<ul className="space-y-3">
			{anchors.map((anchor) => {
				if (!anchor?.href) return null;

				return (
					<li key={anchor.href}>
						<a
							rel="noopener noreferrer"
							target={isExternalLink(anchor.href) ? "_blank" : undefined}
							href={anchor.href}
							className="group flex items-center gap-2"
						>
							<div className="transition-all rounded border border-black/10 dark:border-white/10 size-6 flex items-center justify-center">
								<Icon
									name={anchor.icon}
									className="text-xs opacity-75 group-hover:opacity-100"
								/>
							</div>
							<span className="font-display tracking-wide">{anchor.title}</span>
						</a>
					</li>
				);
			})}
		</ul>
	);
}
