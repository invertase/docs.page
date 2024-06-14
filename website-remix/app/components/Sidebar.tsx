import { ChevronDownIcon } from 'lucide-react';
import { useSidebar } from '~/context';

export function Sidebar() {
  const sidebar = useSidebar();

  return (
    <div className="">
      <div className="relative pt-5 text-sm pl-5">
        {sidebar.map(({ group, pages }) => {
          return (
            <div key={group} className="mb-6">
              <GroupHeading title={group} />
              <SidebarLinks pages={pages} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function GroupHeading(props: { title: string }) {
  return <h3 className="font-medium mb-2 tracking-wide">{props.title}</h3>;
}

type Pages = ReturnType<typeof useSidebar>[number]['pages'];

function SidebarLinks(props: { pages: Pages }) {
  return (
    <ul>
      {props.pages.map(child => {
        if ('group' in child) {
          return null;
        }

        return (
          <li>
            <a
              className="flex items-center relative -left-5 pl-5 pr-2.5 py-1.5 rounded-lg hover:bg-gray-100"
              href="#"
            >
              <span className="flex-1">{child.title}</span>
              <ChevronDownIcon size={16} className="opacity-50" />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
