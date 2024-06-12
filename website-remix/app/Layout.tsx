import { Content } from "./components/Content";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { ThemeScript } from "./components/Theme";

export function Layout() {
  return (
    <>
      <ThemeScript />
      <div className="max-w-8xl relative mx-auto">
        <section className="fixed inset-x-0 top-0 h-16">
          <Header />
        </section>
        <section className="fixed left-0 top-16 bottom-0 px-4">
          <Sidebar />
        </section>
        <div className="pt-16 pl-52">
          <section className="px-4">
            <Content />
          </section>
        </div>
      </div>
    </>
  );
}