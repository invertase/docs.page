import React, { useEffect, useState, createContext, useContext, useCallback } from 'react';
import cx from 'classnames';

// The prefix within local storage for all <Tabs /> components
const PREFIX = 'docs.page:tabs';

type ContextProps = {
  tabs: { [key: string]: string };
  updateTab: (key: string, value: string | null) => void;
  hash: string;
};

// Context holding all local storage items for the PREFIX
const Context = createContext<ContextProps>({
  tabs: {},
  updateTab: () => {
    return;
  },
  hash: '',
});

// Provides context to all <Tabs /> components to allow for listening to
// changes on synchronized tabs.
export function TabsContext({
  children,
  hash,
}: {
  children: React.ReactNode;
  hash: string;
}): JSX.Element {
  const [tabs, setTabs] = useState<Record<string, string>>({});

  const updateTab = useCallback((key: string, value: string | null) => {
    if (value) {
      setTabs($ => ({
        ...$,
        [key]: value,
      }));
    }
  }, []);

  return (
    <Context.Provider
      value={{
        tabs,
        updateTab,
        hash,
      }}
    >
      {children}
    </Context.Provider>
  );
}

// Hook which provides access to any current stored local storage key
// for a provided groupId. Also accepts a local state dispatch and updates it.

// Remove once component working again
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function useTabSynchronization(
  groupId: string,
  setState: React.Dispatch<React.SetStateAction<string | null>>,
): (tab: string) => void {
  const { tabs, updateTab, hash } = useContext(Context);

  const key = `${PREFIX}:${hash}:${groupId}`;
  const value = tabs[key];

  const synchronize = useCallback(
    (tab: string) => {
      localStorage.setItem(key, tab);
      updateTab(key, tab);
    },
    [key, groupId],
  );

  useEffect(() => {
    const initialValue = localStorage.getItem(key);
    updateTab(key, initialValue);
  }, [groupId]);

  useEffect(() => {
    if (groupId && value) {
      setState(value);
    }
  }, [groupId, value]);

  return synchronize;
}

type TabItemElement = React.ReactElement<{
  children: React.ReactNode;
  mdxType: string;
  parentName: string;
  value: string;
}>;

type TabValue = {
  label: string;
  value: string;
};

type TabsProps = {
  groupId?: string;
  defaultValue?: string;
  values: TabValue[];
  children: React.ReactElement;
  className?: string;
};

// MDX v2 has a bug where items are wrapped within `p` tags.
// This function scans the children for all `TabItem` components
// See https://github.com/mdx-js/mdx/issues/1451#issuecomment-863138463
function extractTabItems(children: React.ReactNode): TabItemElement[] {
  let items: TabItemElement[] = [];

  React.Children.forEach(children, child => {
    if (React.isValidElement(child)) {
      if (child.props.children) {
        items = [...items, ...extractTabItems(child.props.children)];
      }

      // @ts-ignore access private name which works on production
      const name = child.type.name;

      if (name === 'TabItem') {
        items = [...items, child];
      }
    }
  });

  return items;
}

// Remove once component working again.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function Tabs(props: TabsProps): JSX.Element {
  if (!props.values?.length) {
    console.warn('<Tabs />: Expected a `values` array.');
    return <></>;
  }

  // MDX wraps components in a `p` tag: https://github.com/mdx-js/mdx/issues/1451
  const tabs = extractTabItems(props.children);

  const [selected, setSelected] = useState<string | null>(() => {
    if (props.groupId) return null;
    return props.defaultValue || props.values[0].value;
  });

  const sync = useTabSynchronization(props.groupId ?? '', setSelected);

  return (
    <div className="mb-6 border dark:border-gray-700 rounded">
      <div className="flex p-2">
        {props.values.map(({ label, value }) => (
          <div
            role="button"
            key={value}
            className={cx(
              'px-6 py-5 flex items-center border-b-2 font-bold hover:bg-gray-500 hover:bg-opacity-10 rounded',
              {
                'border-docs-theme': value === selected,
                'border-transparent': value !== selected,
              },
            )}
            onClick={() => {
              setSelected(value);

              if (props.groupId) {
                sync(value);
              }
            }}
          >
            {label}
          </div>
        ))}
      </div>
      <div className="p-6">
        <style>{`
          div.tab[data-active='true'] {
            display: block;
          }
        `}</style>
        {tabs.map(child => {
          const tab = props.values.find(v => v.value === child.props.value);

          // Ensure the TabItem actually matches the values provided
          if (!tab) {
            return null;
          }

          return (
            <div
              className="tab hidden"
              key={tab.value}
              data-tab={tab.value}
              data-active={(selected === tab.value).toString()}
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
  children: JSX.Element | JSX.Element[];
};

export const TabItem: React.FC<TabItemProps> = (props: TabItemProps) => {
  return <>{props.children}</>;
};
