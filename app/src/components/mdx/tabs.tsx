"use client";

import {
  Children,
  createContext,
  isValidElement,
  type ComponentProps,
  type PropsWithChildren,
  type ReactElement,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDocPageContext } from "@/hooks/use-doc-page-context";
import type { DocsRequestMode } from "@/lib/docs-routing";
import type { ExtraProps } from "streamdown";
import {
  Tabs as TabsRoot,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

type TabProps = PropsWithChildren<{
  groupId?: string;
  defaultValue?: string;
}> &
  ExtraProps;

type TabsContextValue = {
  groups: Record<string, string>;
  onChange: (groupId: string, value: string) => void;
};

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

function useTabs() {
  const context = useContext(TabsContext);

  if (!context) {
    throw new Error("useTabs must be used within a TabsProvider");
  }

  return context;
}

// Used to get the key for local storage for a selected tab group.
function getTabsKey(
  requestMode: DocsRequestMode,
  owner: string,
  repository: string,
  groupId: string,
) {
  return requestMode === "preview"
    ? `preview:tabs:${groupId}`
    : `docs.page:tabs:${owner}/${repository}:${groupId}`;
}

export function TabsProvider({ children }: PropsWithChildren) {
  const [groups, setGroups] = useState<Record<string, string>>({});

  const onChange = useCallback((groupId: string, value: string) => {
    setGroups((existing) => {
      if (existing[groupId] === value) {
        return existing;
      }

      return {
        ...existing,
        [groupId]: value,
      };
    });
  }, []);

  const contextValue = useMemo(
    () => ({ groups, onChange }),
    [groups, onChange],
  );

  return (
    <TabsContext.Provider value={contextValue}>{children}</TabsContext.Provider>
  );
}

type TabItemElementProps = {
  label: string;
  value: string;
  children?: ReactNode;
  node?: ExtraProps["node"];
};

type TabItemElement = ReactElement<TabItemElementProps>;

function isTabItemElement(child: ReactNode): child is TabItemElement {
  if (!isValidElement<Partial<TabItemElementProps>>(child)) {
    return false;
  }

  const { label, value, node } = child.props;
  return (
    node?.tagName === "tab-item" &&
    typeof label === "string" &&
    typeof value === "string"
  );
}

function getTabItems(children: ReactNode): TabItemElement[] {
  return Children.toArray(children).filter(isTabItemElement);
}

export function Tabs(props: TabProps) {
  const tabs = useTabs();
  const { route } = useDocPageContext();
  const { groupId, defaultValue, children } = props;
  const tabItems = getTabItems(children);
  const values = tabItems.map((item) => ({
    label: item.props.label,
    value: item.props.value,
  }));
  const [selected, setSelected] = useState(
    defaultValue ?? values[0]?.value ?? "",
  );
  const didRestoreFromStorage = useRef(false);
  const storageKey = useMemo(
    () =>
      groupId
        ? getTabsKey(route.requestMode, route.owner, route.repository, groupId)
        : null,
    [groupId, route.owner, route.repository, route.requestMode],
  );

  // Keep selected value valid whenever available tabs change.
  useEffect(() => {
    if (values.length === 0) {
      return;
    }

    const hasSelected = values.some((value) => value.value === selected);
    if (hasSelected) {
      return;
    }

    const hasDefaultValue = defaultValue
      ? values.some((value) => value.value === defaultValue)
      : false;
    const fallbackValue = hasDefaultValue
      ? defaultValue
      : (values[0]?.value ?? "");
    if (fallbackValue && fallbackValue !== selected) {
      setSelected(fallbackValue);
    }
  }, [defaultValue, selected, values]);

  // On mount, restore synchronized tab from local storage.
  useEffect(() => {
    if (!groupId || !storageKey || didRestoreFromStorage.current) {
      return;
    }

    didRestoreFromStorage.current = true;
    const storedValue = localStorage.getItem(storageKey);
    if (!storedValue || !values.some((value) => value.value === storedValue)) {
      return;
    }

    setSelected((current) => (current === storedValue ? current : storedValue));
    tabs.onChange(groupId, storedValue);
  }, [groupId, storageKey, tabs, values]);

  // If the selected tab is synchronized, use that value.
  const synchronized = groupId ? tabs.groups[groupId] : undefined;
  useEffect(() => {
    if (
      synchronized &&
      synchronized !== selected &&
      values.some((value) => value.value === synchronized)
    ) {
      setSelected(synchronized);
    }
  }, [selected, synchronized, values]);

  const onValueChange = (value: string) => {
    setSelected(value);

    if (groupId && storageKey) {
      localStorage.setItem(storageKey, value);
      tabs.onChange(groupId, value);
    }
  };

  if (values.length === 0) {
    return null;
  }

  return (
    <TabsRoot value={selected} onValueChange={onValueChange}>
      <TabsList variant="line">
        {values.map((value) => (
          <TabsTrigger key={value.value} value={value.value}>
            {value.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabItems.map((item) => (
        <TabsContent
          key={item.props.value}
          value={item.props.value}
          className="py-5 *:first:mt-0 *:last:mb-0"
        >
          {item}
        </TabsContent>
      ))}
    </TabsRoot>
  );
}
