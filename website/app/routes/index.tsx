import type { MetaFunction } from 'remix';
import cx from 'classnames';
import {
  AdjustmentsIcon,
  AnnotationIcon,
  GlobeAltIcon,
  EyeIcon,
  SearchCircleIcon,
  TemplateIcon,
} from '@heroicons/react/solid';
import { Checkout } from '~/components/Checkout';
import { Footer } from '~/components/Footer';
import { getSocialImage } from '~/utils';

export const meta: MetaFunction = () => ({
  'theme-color': '#ffffff',
  title: 'docs.page | Create an instant Open Source docs page with zero configuration.',
  description: 'Create an instant Open Source docs page with zero configuration.',
  'og:title': 'docs.page',
  'og:description': 'Create an instant Open Source docs page with zero configuration.',
  'og:image': getSocialImage(),
  'og:url': 'http://docs.page',
  'twitter:title': 'docs.page',
  'twitter:description': 'Create an instant Open Source docs page with zero configuration.',
  'twitter:image': getSocialImage(),
  'twitter:card': 'summary_large_image',
});

export default function Index(): JSX.Element {
  return (
    <div>
      <section className="py-16 px-4 text-center lg:py-32 lg:text-left">
        <div className="mx-auto max-w-6xl tracking-wider">
          <div className="mb-4 flex items-center justify-center space-x-4 lg:justify-start">
            <h3 className="font-anton text-4xl">docs.page</h3>
            <a
              href="https://github.com/invertase/docs.page"
              className="text-gray-700 transition-colors duration-100 hover:text-black dark:text-gray-300 dark:hover:text-white"
            >
              <svg className="h-10 w-10 " fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </div>
          <h1 className="font-anton mb-4 bg-gradient-to-br from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-6xl text-transparent dark:from-gray-100 dark:via-gray-300 dark:to-gray-200 lg:text-8xl">
            Instant{' '}
            <span className="bg-gradient-to-br from-green-400 to-blue-500 bg-clip-text text-transparent">
              Open Source
            </span>{' '}
            docs <br /> with zero configuration.
          </h1>
        </div>
      </section>
      <div className="mx-auto max-w-5xl px-4 lg:px-0">
        {/* <div className="mt-4 mb-16 items-center lg:ml-20 lg:flex">
          <div className="flex-1 rounded border bg-green-400 p-4 text-zinc-900">
            <p className="text-center text-lg">
              New! Get started instantly with our{' '}
              <a
                className="cursor-pointer font-bold text-blue-600 visited:text-purple-600 hover:text-blue-800"
                href="https://use.docs.page/getting-started#using-our-cli-tool"
              >
                {' '}
                CLI tool
              </a>
            </p>
          </div>
        </div> */}
        <Heading
          step={1}
          title={
            <span>
              Add a{' '}
              <span className="bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
                docs
              </span>{' '}
              directory to your GitHub repository.
            </span>
          }
          from="from-purple-400"
          to="to-red-500"
        />
        <div className="mt-16 items-center lg:ml-20 lg:flex">
          <div className="flex-1">
            <p className="px-3 text-lg">
              docs.page sources content directly from any Open Source GitHub repository.
            </p>
            <p className="mt-4 px-3 text-lg">
              To get started, create an empty <code className="text-red-400">docs</code> directory
              and a config <code className="text-red-400">docs.json</code> file, both at the root of
              your repository.
            </p>
          </div>
          <div className="flex-1">
            <div className="mt-10 lg:mt-0 lg:pl-8">
              <div>
                <div className="mx-6 rounded-tr rounded-tl border-t border-l border-r border-gray-700 py-3" />
                <div className="flex items-center rounded border border-gray-700 py-3 px-3 font-mono text-sm shadow-xl">
                  <svg
                    height="16"
                    viewBox="0 0 16 16"
                    version="1.1"
                    width="16"
                    className="mr-3 text-white"
                  >
                    <path
                      fill="currentColor"
                      fillRule="evenodd"
                      d="M1.75 1A1.75 1.75 0 000 2.75v10.5C0 14.216.784 15 1.75 15h12.5A1.75 1.75 0 0016 13.25v-8.5A1.75 1.75 0 0014.25 3h-6.5a.25.25 0 01-.2-.1l-.9-1.2c-.33-.44-.85-.7-1.4-.7h-3.5z"
                    />
                  </svg>
                  <div className="flex-col pr-8">
                    <span className="flex">docs</span>
                    <span className="flex">docs.json</span>
                  </div>
                  <span className="text-gray-600">A few seconds ago</span>
                </div>
                <div className="mx-6 rounded-br rounded-bl border-b border-l border-r border-gray-700 py-3" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-32 max-w-5xl px-4 lg:px-0">
        <Heading
          step={2}
          title={
            <span>
              Create an{' '}
              <span className="bg-gradient-to-br from-green-400 to-blue-500 bg-clip-text text-transparent">
                index.mdx
              </span>{' '}
              file.
            </span>
          }
          from="from-green-400"
          to="to-blue-500"
        />
        <div className="mt-16 flex flex-col-reverse items-center lg:ml-20 lg:flex-row">
          <div className="w-full flex-1">
            <div className="mt-10 pr-5 lg:mt-0">
              <div>
                <div className="rounded-tr rounded-tl border border-gray-700 px-3 py-2">
                  <code className="text-sm">docs/index.mdx</code>
                </div>
                <div className="flex">
                  <div className="flex-1 border-r border-l border-gray-700 p-3 font-mono">
                    <div># Installation</div>
                    <br />
                    <div>```bash</div>
                    <div>npm install myawesomelib</div>
                    ```
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <p className="px-3 text-lg">
              Create an <code className="text-blue-500">{`index.mdx`}</code> file at the root of
              your <code className="text-blue-500">/docs</code> directory. docs.page supports nested
              pages based on your directory structure of the directory.
            </p>
            <p className="mt-4 px-3 text-lg">
              Start by writing some <a href="https://www.markdownguide.org/">Markdown</a> content.
              Installation pages are always a great place to start!
            </p>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-32 max-w-5xl px-4 lg:px-0">
        <Heading
          step={3}
          title="Checkout your new documentation!"
          from="from-yellow-400"
          to="to-yellow-500"
        />
        <div className="mt-10 lg:ml-20 lg:flex">
          <Checkout />
        </div>
      </div>
      <div className="mx-auto mt-32 max-w-5xl px-4 lg:px-0">
        <Heading step={4} title="Learn more..." from="from-green-400" to="to-green-500" />
        <div className="mt-10 grid gap-16 text-center lg:ml-20 lg:grid-cols-2">
          <Feature
            href="https://use.docs.page/configuration"
            title={<span className="text-blue-500">Configure</span>}
            text={
              <span>
                Add a <code className="text-blue-400">docs.json</code> file to the root of the
                repository to configure your project by adding a theme, search, navigation,
                analytics and more.
              </span>
            }
            icon={<AdjustmentsIcon width={80} />}
          />
          <Feature
            href="https://use.docs.page/previews"
            title={<span className="text-pink-400">Previews</span>}
            text={
              <span>
                Previewing docs locally with our new Local Preview Mode. Previewing changes on
                branches and pull requests works out of the box with zero configuration. Install our
                GitHub bot for preview assistance.
              </span>
            }
            icon={<EyeIcon width={80} />}
          />
          <Feature
            href="https://use.docs.page/components"
            title={<span className="text-yellow-400">Components</span>}
            text={
              <span>
                By using MDX we provide custom React components to help you build better
                documentation.
              </span>
            }
            icon={<TemplateIcon width={80} />}
          />
          <Feature
            href="https://use.docs.page/custom-domains"
            title={<span className="text-green-400">Domains</span>}
            text={
              <span>
                Using a custom domain name? Simply create a pull request & point your domain to our
                servers. We&apos;ll take care of the rest.
              </span>
            }
            icon={<GlobeAltIcon width={80} />}
          />
          <Feature
            href="https://use.docs.page/github-bot"
            title={<span className="text-purple-500">GitHub Bot</span>}
            text={
              <span>
                Install our GitHub bot on repositories using docs.page. Any new Pull Requests will
                automatically display a publicly available deployment preview URL for your
                documentation.
              </span>
            }
            icon={<AnnotationIcon width={80} />}
          />
          <Feature
            href="https://use.docs.page/search"
            title={<span className="text-red-500">Search</span>}
            text={
              <span>
                Add your DocSearch application ID to your configuration file and instantly get full
                blown documentation search for free, powered by Algolia.
              </span>
            }
            icon={<SearchCircleIcon width={80} />}
          />
        </div>
        <Footer generic={true} />
      </div>
    </div>
  );
}

type ButtonProps = {
  href: string;
  children: string;
};

function Button({ href, children }: ButtonProps): JSX.Element {
  return (
    <a
      href={href}
      className="rounded border border-gray-600 px-6 py-2 no-underline transition-all duration-100 hover:border-gray-300 dark:hover:border-white"
    >
      {children}
    </a>
  );
}

type HeadingProps = {
  step: number;
  title: React.ReactNode;
  from: string;
  to: string;
};

export function Heading({ step, title, from, to }: HeadingProps) {
  return (
    <div className="flex items-center">
      <div
        className={cx(
          'flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br shadow-xl',
          from,
          to,
        )}
      >
        <span className="font-anton text-4xl text-white">{step}</span>
      </div>
      <h2 className="font-anton ml-6 flex-1 text-4xl leading-relaxed">{title}</h2>
    </div>
  );
}

type FeatureProps = {
  href?: string;
  icon: React.ReactElement;
  title: string | React.ReactElement;
  text: React.ReactNode;
};

export function Feature({ href, icon, title, text }: FeatureProps) {
  return (
    <div className="flex flex-col items-center justify-center p-3">
      <div className="flex flex-1 flex-col items-center justify-center">
        {icon}
        <h4 className="font-anton my-8 text-5xl tracking-wide">{title}</h4>
        <p className="min-h-[90px] leading-relaxed">{text}</p>
      </div>
      <div className="mt-10">
        {!!href && <Button href={href}>Learn More</Button>}
        {!href && <div className="text-gray-400">Coming Soon...</div>}
      </div>
    </div>
  );
}
