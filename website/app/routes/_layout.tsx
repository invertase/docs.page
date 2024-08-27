import { Outlet } from "@remix-run/react";
import { useInlineScript } from "~/hooks";

export default function Layout() {
  const scripts = useInlineScript(`<script>(() => {
		document.documentElement.setAttribute('data-theme', 'dark');
    const root = document.documentElement;
		root.style.setProperty('--background-dark', '224, 71%, 4%');		
	})()</script>`);

  return (
    <>
      {scripts}
      <script
        defer
        data-domain="docs.page"
        src="https://plausible.io/js/script.js"
      />
      <Outlet />
    </>
  );
}
