import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import type { SidebarGroup } from "~/api";
import { Link } from "~/components/Link";
import { usePageContext, useSidebar } from "~/context";

type AnchorSource = { title: string; href: string };

export function PreviousNext() {
	const ctx = usePageContext();
	const sidebar = useSidebar();

	const frontmatter = ctx.bundle.frontmatter;

	// Whether to automatically infer the next and previous pages.
	// This can be disabled by setting `content.automaticallyInferNextPrevious`
	// to `false` in the bundle config. Otherwise, it will be enabled by default.
	const automaticallyInferNextPrevious = !(
		ctx.bundle.config.content?.automaticallyInferNextPrevious === false
	);

	// A flattened list of all sidebar items.
	const flattened: AnchorSource[] = [];

	// Recursively flatten the sidebar.
	function flattenGroup(group: SidebarGroup) {
		// If the group has an href, add it to the flattened list
		if ("href" in group && group.href) {
			flattened.push({ href: group.href, title: group.group });
		}

		// Recursively flatten the pages
		for (const page of group.pages) {
			if ("pages" in page) {
				flattenGroup(page);
			} else {
				flattened.push(page);
			}
		}
	}

	// Flatten the sidebar.
	sidebar.forEach(flattenGroup);

	function findAnchor(href: string) {
		return flattened.find((anchor) => anchor.href === href);
	}

	let previous: AnchorSource | undefined;
	let next: AnchorSource | undefined;

	// If the user has automatic page inference, find the previous and next pages
	// based on the current page's position in the sidebar.
	if (automaticallyInferNextPrevious) {
		const currentIndex = flattened.findIndex(
			(anchor) => anchor.href === ctx.path,
		);
		const previousCursor = flattened[currentIndex - 1];
		const nextCursor = flattened[currentIndex + 1];
		if (currentIndex > 0)
			previous = { title: previousCursor.title, href: previousCursor.href };
		if (currentIndex < flattened.length - 1)
			next = { title: nextCursor.title, href: nextCursor.href };
	}

	// If the page has a `previous` href, use that instead.
	if (frontmatter.previous) {
		previous = {
			title: frontmatter.previousTitle
				? String(frontmatter.previousTitle)
				: findAnchor(String(frontmatter.previous))?.title ?? "",
			href: String(frontmatter.previous),
		};
	}

	// If the page has a `next` href, use that instead.
	if (frontmatter.next) {
		next = {
			title: frontmatter.nextTitle
				? String(frontmatter.nextTitle)
				: findAnchor(String(frontmatter.next))?.title ?? "",
			href: String(frontmatter.next),
		};
	}

	// If there is no previous or next page, return null.
	if (!previous && !next) return null;

	return (
		<div className="flex items-center gap-3 font-display py-6">
			{previous ? (
				<div className="flex-1">
					<Anchor {...previous} type="previous" />
				</div>
			) : null}
			{next ? (
				<div className="flex-1 flex justify-end">
					<Anchor {...next} type="next" />
				</div>
			) : null}
		</div>
	);
}

function Anchor(props: AnchorSource & { type: "previous" | "next" }) {
	return (
		<Link
			href={props.href}
			className="inline-flex items-center gap-2 transition-opacity opacity-75 hover:opacity-100"
		>
			{props.type === "previous" ? <ChevronLeftIcon size={16} /> : ""}
			<span>{props.title}</span>
			{props.type === "next" ? <ChevronRightIcon size={16} /> : ""}
		</Link>
	);
}
