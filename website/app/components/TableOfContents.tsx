import { ListTreeIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { usePageContext, useTabs } from "~/context";
import { cn } from "~/utils";

export function TableOfContents() {
	const ctx = usePageContext();
	const hasTabs = useTabs().length > 0;
	const headings = ctx.bundle.headings;
	const [activeId, setActiveId] = useState("");

	useEffect(() => {
		const handleScroll = () => {
			const sections = document.querySelectorAll("main div[data-section]");
			let active = "";

			for (const section of sections) {
				const span = section.querySelector("span:first-child");
				if (span && span.getBoundingClientRect().y < 1) {
					active = section.getAttribute("data-section") || "";
				}
			}

			setActiveId(active);
		};

		window.addEventListener("scroll", handleScroll);

		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	return (
		<div
			className={cn("sticky", {
				"top-24": !hasTabs,
				"top-32": hasTabs,
			})}
		>
			<h3 className="flex items-center gap-2 opacity-75 font-bold text-[15px] mb-2">
				<ListTreeIcon size={20} />
				<span>On this page</span>
			</h3>
			<ul className="mt-4 space-y-2">
				{headings.map((heading) => {
					return (
						<li
							key={heading.id}
							style={{
								paddingLeft: `${((heading.rank || 2) - 2) * 0.75}rem`,
							}}
						>
							<a
								href={`#${heading.id}`}
								className={cn("text-[14px]", {
									"text-primary": activeId === heading.id,
								})}
							>
								{heading.title}
							</a>
						</li>
					);
				})}
			</ul>
		</div>
	);
}
