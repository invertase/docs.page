import locales from 'locale-codes';
import FontAwesome from '@components/FontAwesome';
import { ChevronDownIcon } from '@components/icons';
import Link from '@components/Link';
import context from 'src/context';
import { isExternalLink } from 'src/utils';
import RefBadge from '@components/RefBadge';
import { useEffect, useState } from 'react';
import { useStore } from '@nanostores/react';
import { type BundleConfig } from 'src/bundle';

export default function Sidebar() {
  const { owner, repository, ref, config, locale, sidebar } = useStore(context);
  const [anchors, setAnchors] = useState<BundleConfig['anchors']>(config.anchors || []);

  function getLinkRef(href: string): string | undefined {
    if (isExternalLink(href)) {
      return;
    }

    return 'prefetch';
  }

  function getLocaleString(locale: string): string {
    const found = locales.getByTag(locale);
    return found ? found.name : locale;
  }

  useEffect(() => {
    setAnchors([
      ...anchors,
      {
        icon: 'github',
        title: 'GitHub',
        link: repository ? `https://github.com/${owner}/${repository}` : 'https://github.com/',
      },
    ]);

    if (config.twitter) {
      setAnchors([
        ...anchors,
        {
          icon: 'twitter',
          title: 'Twitter',
          link: `https://twitter.com/${config.twitter}`,
        },
      ]);
    }
    const locale = document.querySelector('select#locale');

    if (locale) {
      locale.addEventListener('change', event => {
        const { value } = event.target as HTMLSelectElement;
        let href = repository ? `/${owner}/${repository}` : `/${owner}`;
        if (ref) href += `~${encodeURIComponent(ref)}`;
        window.location.href = href + `/${value}`;
      });
    }
  }, []);

  return (
    <nav className="mt-9 overscroll-contain">
      <div className="mb-6 lg:hidden">
        <RefBadge />
      </div>
      <ul className="mb-6 space-y-3">
        {anchors.map(anchor => (
          <li key={anchor.link}>
            <Link href={anchor.link} className="group flex items-center gap-2">
              <span className="group-hover:bg-docs-theme inline-flex h-6 w-6 items-center justify-center rounded border text-[14px] opacity-75 transition group-hover:border-transparent group-hover:text-white group-hover:opacity-100 dark:border-zinc-700">
                <FontAwesome name={anchor.icon} />
              </span>
              <span className="text-sm font-medium tracking-wide opacity-75 transition group-hover:opacity-100">
                {anchor.title}
              </span>
            </Link>
          </li>
        ))}
      </ul>
      {locale && config.locales.length > 0 && (
        <ul className="pr-8">
          <li className="relative">
            <select
              id="locale"
              className="w-full appearance-none rounded border bg-transparent py-1 pl-2 pr-8 text-sm dark:border-zinc-700"
            >
              {config.locales.map(value => (
                <option key={value} selected={locale === value} value={value}>
                  {getLocaleString(value)}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute top-[7px] right-2 h-4 w-4">
              <ChevronDownIcon />
            </div>
          </li>
        </ul>
      )}
      <ul className="lg:text-sm lg:leading-6">
        {sidebar.map(([title, urlOrChildren], index) => {
          if (typeof urlOrChildren === 'string') {
            return (
              <li key={urlOrChildren}>
                <Link
                  href={urlOrChildren}
                  className="mb-3 block font-medium  opacity-75 transition hover:opacity-100"
                  activeClassNames={'text-docs-theme opacity-100'}
                  rel={getLinkRef(urlOrChildren)}
                >
                  {title}
                </Link>
              </li>
            );
          }

          return (
            <li className="my-8" key={index}>
              <h5 className="mb-3 block font-semibold tracking-wide">{title}</h5>
              <ul className="space-y-2 border-l dark:border-slate-700">
                {urlOrChildren.map(([title, url]) => (
                  <li key={url}>
                    <Link
                      href={url}
                      className="hover:border-docs-theme relative -left-px block border-l border-transparent pl-4 opacity-75 transition hover:opacity-100"
                      activeClassNames={
                        'border-docs-theme opacity-100 font-semibold tracking-wide text-docs-theme'
                      }
                      rel={getLinkRef(url)}
                    >
                      {title}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
