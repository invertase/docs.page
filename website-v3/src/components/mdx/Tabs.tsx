type TabsProps = {
  groupId?: string;
  defaultValue?: string;
  values: TabValue[];
  children: React.ReactElement;
  className?: string;
};

type TabValue = {
  label: string;
  value: string;
};

type TabItemElement = React.ReactElement<{
  children: React.ReactNode;
  mdxType: string;
  parentName: string;
  value: string;
}>;

const Tabs: React.FC<TabsProps> = props => {
  if (props.values.length === 0) {
    return <div />;
  }

  return <div>TODO TABS</div>;
};

export const TabItem: React.FC<{ value: string }> = props => {
  return <div>TODO TAB ITEM</div>;
};

export default Tabs;
