import React from "react";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

export type LayoutType = "default" | "wide" | "full" | "bare";

export const DEFAULT_LAYOUT: LayoutType = "default";

type LayoutProps = {
  type: LayoutType;
  children: React.ReactNode | React.ReactNode[];
};

export function Layout(props: LayoutProps) {
  switch (props.type) {
    case "wide":
      return <WideLayout {...props} />;
    case "full":
      return <FullLayout {...props} />;
    case "bare":
      return <BareLayout {...props} />;
    case "default":
    default:
      return <DefaultLayout {...props} />;
  }
}

export function DefaultLayout({ children }: LayoutProps) {
  return (
    <>
      <Header />
      <section className="flex bg-white dark:bg-gray-900">
        <nav className="fixed inset-y-0 w-64 hidden desktop:block">
          <div className="flex h-full mt-16 overflow-y-auto overflow-x-hidden border-r dark:border-gray-700 p-4">
            <Sidebar />
          </div>
        </nav>
        <div className="flex-1 pl-0 desktop:pl-64">
          <article className="px-1 lg:px-0 py-20 prose max-w-2xl mx-auto">
            {children}
          </article>
          <Footer />
        </div>
      </section>
    </>
  );
}

export function WideLayout({ children }: LayoutProps) {
  return (
    <>
      <Header />
      <article className="px-4 lg:px-0 prose mx-auto py-24 max-w-6xl">
        {children}
      </article>
    </>
  );
}

export function FullLayout({ children }: LayoutProps) {
  return (
    <>
      <Header />
      <article className="prose py-24 max-w-full">{children}</article>
    </>
  );
}

export function BareLayout({ children }: LayoutProps) {
  return <div>{children}</div>;
}
