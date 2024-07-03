import {
	Disclosure,
	DisclosureButton,
	DisclosurePanel,
} from "@headlessui/react";
import { ChevronRightIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "~/utils";
import { Icon } from "../Icon";

type AccordionProps = ComponentProps<"div"> & {
	title: string;
	icon?: string;
	defaultOpen?: boolean;
};

export function Accordion(props: AccordionProps) {
	const { title, icon, defaultOpen, className, ...rest } = props;

	if (!title) {
		return null;
	}

	return (
		<Disclosure
			as="div"
			className="border-x border-t last:border-b first-of-type:rounded-t-md last-of-type:rounded-b-md border-black/10 dark:border-white/10 only-of-type:shadow-sm"
			defaultOpen={defaultOpen}
		>
			<DisclosureButton className="group group-data-[open]:rounded-t-md group-data-[closed]:rounded-md flex w-full items-center gap-1.5 px-4 py-3 hover:bg-black/5 hover:dark:bg-white/5">
				<ChevronRightIcon size={18} className="group-data-[open]:rotate-90" />
				{icon ? <Icon name={icon} className="w-6 h-6" /> : null}
				<span>{title}</span>
			</DisclosureButton>
			<DisclosurePanel className="p-5">
				<div
					{...rest}
					className={cn(
						"[&>:first-child]:mt-0 [&>:last-child]:mb-0",
						className,
					)}
				>
					{props.children}
				</div>
			</DisclosurePanel>
		</Disclosure>
	);
}

type AccordionGroupProps = ComponentProps<"div">;

// Simple wrapper for grouping multiple accordions, as we use css first child and last child selectors.
export function AccordionGroup(props: AccordionGroupProps) {
	return (
		<div {...props} className="shadow-sm">
			{props.children}
		</div>
	);
}
