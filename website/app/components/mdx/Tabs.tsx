import {
	Children,
	type ComponentProps,
	createContext,
	isValidElement,
	useContext,
	useEffect,
	useState,
} from "react";
import { type Context, usePageContext } from "~/context";
import { cn } from "~/utils";

// Used to get the key for the local storage for the selected tab group.
function getTabsKey(context: Context, value: string) {
	return context.preview
		? `preview:tabs:${value}`
		: `docs.page:tabs:${context.owner}/${context.repository}:${value}`;
}

const TabsContext = createContext<
	| {
			groups: Record<string, string>;
			onChange: (groupId: string, value: string) => void;
	  }
	| undefined
>(undefined);

// Provider for the tabs context, which keeps track of the selected tab for each group.
export function TabsProvider(props: ComponentProps<"div">) {
	const [groups, setGroups] = useState<Record<string, string>>({});

	const onChange = (groupId: string, value: string) => {
		setGroups((groups) => ({
			...groups,
			[groupId]: value,
		}));
	};

	return (
		<TabsContext.Provider value={{ groups, onChange }}>
			<div {...props} />
		</TabsContext.Provider>
	);
}

function useTabs() {
	const context = useContext(TabsContext);

	if (!context) {
		throw new Error("useTabs must be used within a TabsProvider");
	}

	return context;
}

type TabsProps = ComponentProps<"div"> & {
	groupId?: string;
	values: {
		label: string;
		value: string;
	}[];
	defaultValue?: string;
};

export function Tabs(props: TabsProps) {
	const tabs = useTabs();
	const ctx = usePageContext();
	const [selected, setSelected] = useState(
		props.defaultValue || props.values[0].value,
	);

	const groupId = props.groupId;

	// On mount, get the selected tab from local storage if groupId is provided.
	useEffect(() => {
		if (!groupId) {
			return;
		}

		const key = getTabsKey(ctx, groupId);
		const value = localStorage.getItem(key);

		if (value) {
			setSelected(value);
			tabs.onChange(groupId, value);
		}
	}, [tabs, ctx, groupId]);

	// Get the synchronized selected tab if groupId is provided.
	const synchronized = groupId ? tabs.groups[groupId] : undefined;

	// If the selected tab is synchronized, update the selected tab.
	useEffect(() => {
		if (synchronized) {
			setSelected(synchronized);
		}
	}, [synchronized]);

	// Update the current tab on change.
	const onChange = (value: string) => {
		setSelected(value);

		// If a groupId is provided, save the selected tab to local storage and update the parent context.
		if (groupId) {
			const key = getTabsKey(ctx, groupId);
			localStorage.setItem(key, value);
			tabs.onChange(groupId, value);
		}
	};

	// If there are no values, return null.
	if (!props.values || props.values.length === 0) {
		return null;
	}

	return (
		<div>
			<div className="flex items-center gap-5 border-b border-black/10 dark:border-white/10">
				{props.values.map((tab) => (
					<button
						type="button"
						key={tab.value}
						onClick={() => onChange(tab.value)}
						className={cn("font-bold py-3 border-b-2", {
							"border-primary text-primary": tab.value === selected,
							"border-transparent hover:border-black/10 hover:dark:border-white/20":
								tab.value !== selected,
						})}
					>
						{tab.label}
					</button>
				))}
			</div>
			<div>
				{Children.map(props.children, (child) => {
					if (!child || !isValidElement(child) || child.type !== TabItem) {
						return null;
					}

					const { value, ...rest } = child.props;

					return (
						<div
							{...rest}
							key={child.props.value}
							className={cn("py-5", {
								hidden: value !== selected,
							})}
						/>
					);
				})}
			</div>
		</div>
	);
}

type TabItemProps = ComponentProps<"div"> & {
	value: string;
};

export function TabItem({ value, ...props }: TabItemProps) {
	if (!value) {
		return null;
	}

	return <div data-tab-value={value} {...props} />;
}
