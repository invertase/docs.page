import React, {
  useEffect,
  useState,
  createContext,
  useContext,
  useCallback,
} from "react";
import cx from "classnames";
import { SlugPropertiesContext } from "../properties";

// The prefix within local storage for all <Tabs /> components
const PREFIX = "docs.page.tabs.";

type ContextProps = {
  prefix: string;
  tabs: { [key: string]: string };
  updateTab: (groupId: string, tab: string) => void;
};

// Context holding all local storage items for the PREFIX
const Context = createContext<ContextProps>({
  prefix: "",
  tabs: {},
  updateTab: () => {},
});

// Provides context to all <Tabs /> components.
// Once the window is available, all local storage keys matching the prefix
// are populated in
export function TabsContext({ children }: { children: React.ReactNode }) {
  const { hash } = useContext(SlugPropertiesContext);
  const [data, setData] = useState({});

  const updateTab = useCallback((groupId: string, value: string) => {
    const key = `${hash}.${PREFIX}${groupId}`;
    localStorage.setItem(key, value);
    setData((obj) => ({
      ...obj,
      [key]: value,
    }));
  }, []);

  useEffect(() => {
    const out = {};
    for (let i = 0; i < localStorage.length; i += 1) {
      const storageKey = localStorage.key(i) as string;
      if (storageKey.startsWith(`${hash}.${PREFIX}`)) {
        const item = localStorage.getItem(storageKey);
        out[storageKey] = item;
      }
    }
    setData(out);
  }, []);

  return (
    <Context.Provider
      value={{
        prefix: `${hash}.${PREFIX}`,
        tabs: data,
        updateTab,
      }}
    >
      {children}
    </Context.Provider>
  );
}

// Hook which provides access to any current stored local storage key
// for a provided groupId. Also accepts a local state dispatch and updates it.
function useTabSynchronization(
  groupId: string,
  setState: React.Dispatch<React.SetStateAction<string>>
): (tab: string) => void {
  const { tabs, updateTab, prefix } = useContext(Context);
  const value = tabs[`${prefix}${groupId}`];

  useEffect(() => {
    if (!groupId) return;
    if (value) {
      setState(value);
    }
  }, [groupId, value]);

  const synchronize = useCallback(
    (tab: string) => {
      setState(tab);

      if (groupId) {
        updateTab(groupId, tab);
      }
    },
    [groupId]
  );

  return synchronize;
}

type TabValue = {
  label: string;
  value: string;
};

type TabsProps = {
  groupId?: string;
  defaultValue?: string;
  values: TabValue[];
  children: React.ReactElement[];
  className?: string;
};

export function Tabs({
  groupId,
  defaultValue,
  values,
  children,
  className,
}: TabsProps) {
  const [selected, setSelected] = useState<string>(defaultValue);
  const synchronize = useTabSynchronization(groupId, setSelected);

  return (
    <div className="border mb-4 dark:border-gray-800 rounded p-1">
      <div
        role="tablist"
        aria-orientation="horizontal"
        className={cx("flex", className)}
      >
        {values.map(({ value, label }) => {
          const active = value === selected;

          return (
            <div
              key={value}
              role="tab"
              tabIndex={0}
              aria-selected={active}
              onClick={() => synchronize(value)}
              className={cx(
                "cursor-pointer px-5 py-5 rounded font-bold hover:bg-gray-200 dark:hover:bg-gray-800",
                {
                  "border-b-4": active,
                }
              )}
              style={{
                color: value === selected ? "var(--theme-color)" : "inherit",
                borderColor: "var(--theme-color)",
              }}
            >
              {label}
            </div>
          );
        })}
      </div>
      <div className="p-3">
        {children.map((child, index: number) => {
          return React.cloneElement(child, {
            key: child.props.value || index,
            hidden: child.props.value !== selected,
          });
        })}
      </div>
    </div>
  );
}

type TabItemProps = {
  hidden: boolean;
  children: React.ReactElement | React.ReactElement[];
};

export function TabItem({ hidden, children }: TabItemProps) {
  return (
    <div
      role="tabpanel"
      className={cx({
        hidden,
      })}
    >
      {children}
    </div>
  );
}
