import React, { isValidElement, PropsWithChildren } from 'react';
import context from 'src/context';

type TabsProps = {
  groupId?: string;
  defaultValue?: string;
  values: {
    label: string;
    value: string;
  }[];
  children: React.ReactElement;
};

const Tabs: React.FC<TabsProps> = props => {
  const ctx = context.get();
  const { children, values, groupId, defaultValue } = props;

  if (!values || values.length === 0) {
    return <div />;
  }

  const tabs = React.Children.map(children, child => {
    if (isValidElement(child)) {
      const el = child as React.ReactElement;
      if (values.find(({ value }) => value === el.props.value)) {
        return child;
      }
    }

    return null;
  }).filter(Boolean);

  // Get the server rendered active state.
  let active = ctx.tabs[groupId ?? ''] || defaultValue || values[0].value;

  // Sanity check the active state (e.g. incase it's old or invalid)
  if (!values.find(({ value }) => value === active)) {
    active = values[0].value;
  }

  return (
    <div data-tab-group data-tab-group-id={groupId}>
      <div className="flex items-center gap-x-6 overflow-x-auto overflow-y-hidden border-b-2 border-gray-200 dark:border-zinc-800">
        {props.values.map(value => (
          <button
            key={value.value}
            data-tab-group-button
            data-tab-group-button-id={value.value}
            aria-selected={value.value === active}
            className={
              'aria-selected:text-docs-theme aria-selected:opacity-100 relative h-12 whitespace-nowrap font-semibold tracking-wide opacity-75 transition hover:opacity-100'
            }
          >
            <span>{value.label}</span>
          </button>
        ))}
      </div>
      <div>
        {tabs.map((tab: React.ReactElement, index) => {
          return (
            <div
              data-tab-group-pane
              data-tab-group-pane-id={values[index].value}
              key={tab.props.value}
              data-tab={tab.props.value}
              aria-expanded={tab.props.value === active}
              className="aria-expanded:block [&>:first-child]:mt-0 hidden pt-6"
            >
              {tab}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const TabItem: React.FC<PropsWithChildren> = props => {
  return <>{props.children}</>;
};

export default Tabs;
