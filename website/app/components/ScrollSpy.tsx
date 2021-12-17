import cx from 'classnames';
import { useEffect } from 'react';
import { useDocumentationContext } from "~/context";

export function ScrollSpy() {
  const { headings } = useDocumentationContext();

  // TODO
  useEffect(() => {
    const observer = new IntersectionObserver(() => {

    });

    return () => observer.disconnect();
  }, []);

  if (!headings) {
    return <ul />
  }

  return (
    <ul className="text-sm space-y-2">
      {headings.map(heading => (
        <li
          className={cx({
            'font-semibold': false,
          })}
        >
          <a href={`#${heading.id}`}>{heading.title}</a>
        </li>
      ))}
    </ul>
  );
}
