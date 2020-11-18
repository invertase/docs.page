import React, {
  useEffect,
  useState,
  createContext,
  useContext,
  useCallback,
  createRef,
  RefObject,
} from "react";
import cx from "classnames";
import { SlugPropertiesContext } from "../properties";

// The prefix within local storage for all <Tabs /> components
const PREFIX = "docs.page.tabs";

type ContextProps = {
  tabs: { [key: string]: string };
  updateTab: (key: string, value: string) => void;
};

// Context holding all local storage items for the PREFIX
const Context = createContext<ContextProps>({
  tabs: {},
  updateTab: () => {},
});

export function TabsContext({ children }: { children: React.ReactNode }) {
  const [tabs, setTabs] = useState({});

  const updateTab = useCallback((key: string, value: string) => {
    setTabs(($) => ({
      ...$,
      [key]: value,
    }));
  }, []);

  return (
    <Context.Provider
      value={{
        tabs,
        updateTab,
      }}
    >
      {children}
    </Context.Provider>
  );
}

// // Provides context to all <Tabs /> components.
// // Once the window is available, all local storage keys matching the prefix
// // are populated in
// export function TabsContext({ children }: { children: React.ReactNode }) {
//   const { hash } = useContext(SlugPropertiesContext);
//   const [data, setData] = useState({});

//   const updateTab = useCallback((groupId: string, value: string) => {
//     const key = `${PREFIX}.${hash}.${groupId}`;
//     localStorage.setItem(key, value);
//     setData((obj) => ({
//       ...obj,
//       [key]: value,
//     }));
//   }, []);

//   useEffect(() => {
//     const out = {};
//     for (let i = 0; i < localStorage.length; i += 1) {
//       const storageKey = localStorage.key(i) as string;
//       if (storageKey.startsWith(`${PREFIX}.${hash}`)) {
//         const item = localStorage.getItem(storageKey);
//         out[storageKey] = item;
//       }
//     }
//     setData(out);
//   }, []);

//   return (
//     <Context.Provider
//       value={{
//         prefix: `${PREFIX}.${hash}`,
//         tabs: data,
//         updateTab,
//       }}
//     >
//       {children}
//     </Context.Provider>
//   );
// }

// Hook which provides access to any current stored local storage key
// for a provided groupId. Also accepts a local state dispatch and updates it.
function useTabSynchronization(
  groupId: string,
  setState: React.Dispatch<React.SetStateAction<string>>
): (tab: string) => void {
  const { hash } = useContext(SlugPropertiesContext);
  const { tabs, updateTab } = useContext(Context);

  const key = `${PREFIX}.${hash}.${groupId}`;
  const value = tabs[key];

  const synchronize = useCallback(
    (tab: string) => {
      localStorage.setItem(key, tab);
      updateTab(key, tab);
    },
    [key, groupId]
  );

  useEffect(() => {
    if (groupId && value) {
      setState(value);
    }
  }, [groupId, value]);

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
  const { hash } = useContext(SlugPropertiesContext);
  const [selected, setSelected] = useState<string>(() => {
    if (groupId) return null;
    return defaultValue || values[0].value;
  });
  const synchronize = useTabSynchronization(groupId, setSelected);

  const tabRefs: RefObject<HTMLDivElement>[] = [];
  const paneRefs: RefObject<HTMLDivElement>[] = [];

  // Push references for each supplied "value"
  values.forEach(() => {
    tabRefs.push(createRef<HTMLDivElement>());
    paneRefs.push(createRef<HTMLDivElement>());
  });

  function onChangeTab(tab: string) {
    console.log('onChangeTab', tab);
    tabRefs.forEach((ref) => {
      if (ref.current.dataset.tabValue === tab) {
        ref.current.classList.add("active");
      } else {
        ref.current.classList.remove("active");
      }
    });

    paneRefs.forEach((ref, ri) => {
      if (ref.current.dataset.paneValue === tab) {
        ref.current.classList.remove("hidden");
      } else {
        ref.current.classList.add("hidden");
      }
    });
  }

  // Whenever the selected tab changes, calculate the class of the
  // ref elements.
  useEffect(() => {
    if (selected) {
      onChangeTab(selected);
    }
  }, [selected]);

  return (
    <div
      className="border mb-4 dark:border-gray-800 rounded p-1"
      data-tabs-id={groupId ? `${PREFIX}.${hash}.${groupId}` : ""}
    >
      <style jsx>{`
        div[role="tab"].active {
          border-bottom-width: 4px;
          color: var(--theme-color);
          border-color: var(--theme-color);
        }
      `}</style>
      <div
        role="tablist"
        aria-orientation="horizontal"
        className={cx("flex", className)}
      >
        {values.map(({ value, label }, index) => {
          // const active = value === selected;

          return (
            <div
              key={value}
              ref={tabRefs[index]}
              data-tab-value={value}
              role="tab"
              tabIndex={0}
              onClick={() => {
                if (groupId) synchronize(value);
                else setSelected(value);
              }}
              className={
                "cursor-pointer px-5 py-5 rounded font-bold hover:bg-gray-200 dark:hover:bg-gray-800"
              }
            >
              {label}
            </div>
          );
        })}
      </div>
      <div className="p-3">
        {children.map((child, index: number) => {
          const value = child.props.value;

          // It's not a <TabItem /> or the `value` prop is missing, so ignore.
          if (!value) {
            return null;
          }

          const refIndex = values.findIndex(($) => $.value === value);

          // It's a <TabItem /> with a `value` prop, but we cant match the value.
          if (refIndex < 0) {
            return null;
          }

          return (
            <div
              ref={paneRefs[refIndex]}
              role="tabpanel"
              data-pane-value={values[refIndex].value}
            >
              {child}
            </div>
          );
        })}
      </div>
    </div>
  );
}

type TabItemProps = {
  id: string;
  children: React.ReactElement | React.ReactElement[];
};

export function TabItem(props: TabItemProps) {
  return props.children;
}
