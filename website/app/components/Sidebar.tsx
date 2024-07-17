import { NavLink, useLocation } from "@remix-run/react";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { type ReactElement, cloneElement, useState } from "react";
import { useHref, usePageContext, useSidebar } from "~/context";
import { cn, getHref } from "~/utils";
import { Anchors } from "./Anchors";
import { Icon } from "./Icon";

type Pages = ReturnType<typeof useSidebar>[number]["pages"];

export function Sidebar() {
	const sidebar = useSidebar();

	return (
		<div className="relative pt-8 text-sm pl-5 pb-5 space-y-6">
			<Anchors />
			<div>
				{sidebar.map(({ group, icon, pages }) => {
					return (
						<div key={group} className="mb-6">
							<GroupHeading title={group} icon={icon} />
							<SidebarLinks pages={pages} open={false} depth={0} />
						</div>
					);
				})}
			</div>
		</div>
	);
}

// Displays a top-level group heading
function GroupHeading(props: { title: string; icon?: string }) {
	return (
		<h3 className="font-display font-medium text-[15px] mb-2 tracking-wider flex items-center gap-2">
			{props.icon ? <Icon name={props.icon} /> : null}
			<span>{props.title}</span>
		</h3>
	);
}

// A recursive sidebar navigation component, renders a list of links and groups.
function SidebarLinks(
	props: { pages: Pages } & { open: boolean; depth: number },
) {
	return (
		<ul
			aria-expanded={props.open}
			className={cn({
				"pl-[16px]": props.depth > 0,
			})}
		>
			{props.pages.map((child, index) => {
				return (
					<SidebarGroup
						key={`${props.depth}-${index}`}
						group={child}
						depth={props.depth}
					/>
				);
			})}
		</ul>
	);
}

// Renders a group of sidebar links, either as a link or a group of links.
function SidebarGroup(props: { group: Pages[number] } & { depth: number }) {
	const location = useLocation();
	const ctx = usePageContext();

	// A recursive function to determine if this group
	// has an active child link. If so, it is open.
	function hasActiveChild(pages: Pages): boolean {
		for (const page of pages) {
			if ("group" in page) {
				if (hasActiveChild(page.pages)) {
					return true;
				}
			} else {
				const href = getHref(ctx, page.href);
				if (location.pathname === href) {
					return true;
				}
			}
		}
		return false;
	}

	// Determine if this group has an active child link.
	const activeChild =
		"group" in props.group ? hasActiveChild(props.group.pages) : false;

	const [open, setOpen] = useState(activeChild);

	if (!("group" in props.group)) {
		return (
			<li>
				<SidebarAnchor
					href={props.group.href}
					title={props.group.title}
					depth={props.depth}
					icon={props.group.icon}
				/>
			</li>
		);
	}

	return (
		<li
			className={cn("relative", {
				"before:content-[''] before:absolute before:mt-9 before:border-l-[0.5px] before:inset-0 before:border-black/20 before:dark:border-white/20":
					open,
			})}
		>
			<SidebarAnchor
				title={props.group.group}
				depth={props.depth}
				href={props.group.href}
				icon={props.group.icon}
				collapse={
					open ? <ChevronUpIcon size={14} /> : <ChevronDownIcon size={14} />
				}
				onClick={() => setOpen((open) => !open)}
			/>
			{open ? (
				<SidebarLinks
					pages={props.group.pages}
					depth={props.depth + 1}
					open={open}
				/>
			) : null}
		</li>
	);
}

// Renders a sidebar link with an optional icon.
function SidebarAnchor(props: {
	title: string;
	depth: number;
	href?: string;
	icon?: string;
	collapse?: ReactElement;
	onClick?: () => void;
}) {
	const href = useHref(props.href ?? "");
	const className = cn(
		"relative group flex items-center pr-5 py-[7.5px] text-[14.5px] gap-2 text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300",
	);

	const element = props.href ? (
		<NavLink
			end
			to={href}
			onClick={props.collapse ? props.onClick : undefined}
			className={({ isActive }) =>
				cn(className, {
					"before:content-[''] before:absolute before:border-l-2 before:-left-4 before:bottom-0 before:top-px before:border-primary":
						isActive && props.depth > 0,
					"[&>span]:dark:text-white [&>span]:text-gray-950 [&>span]:font-medium":
						isActive,
				})
			}
		/>
	) : (
		<div
			role="button"
			className={className}
			onKeyDown={props.onClick}
			onClick={props.onClick}
		/>
	);

	return cloneElement(element, {}, [
		props.icon ? (
			<span key="icon">
				<Icon key="icon" name={props.icon} />
			</span>
		) : null,
		<span key="title" className="flex-1">
			{props.title}
		</span>,
		props.collapse ? (
			<div key="toggle" onKeyDown={props.onClick} onClick={props.onClick}>
				{props.collapse}
			</div>
		) : null,
	]);
}
