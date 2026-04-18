import { useDocPageContext } from "@/hooks/use-doc-page-context";
import { runSync } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import { type ComponentProps, memo, useMemo } from "react";

export function Prose() {
  const { bundle } = useDocPageContext();

  const MDX = useMemo(() => {
    return memo(() => {
      const { default: MDX } = runSync(
        bundle.code,
        { ...runtime },
      );

      return (
        <MDX
        components={{
        //   /* HTML Overrides */
        //   h1: (props: ComponentProps<"h1">) => (
        //     <Heading {...props} type="h1" />
        //   ),
        //   h2: (props: ComponentProps<"h2">) => (
        //     <Heading {...props} type="h2" anchor="true" />
        //   ),
        //   h3: (props: ComponentProps<"h3">) => (
        //     <Heading {...props} type="h3" anchor="true" />
        //   ),
        //   h4: (props: ComponentProps<"h4">) => (
        //     <Heading {...props} type="h4" anchor="true" />
        //   ),
        //   h5: (props: ComponentProps<"h5">) => (
        //     <Heading {...props} type="h5" anchor="true" />
        //   ),
        //   h6: (props: ComponentProps<"h6">) => (
        //     <Heading {...props} type="h6" anchor="true" />
        //   ),
        //   hr: (props: ComponentProps<"hr">) => (
        //     <div
        //       {...props}
        //       className="h-px dark:bg-white/10 bg-black/10 my-6"
        //     />
        //   ),
        //   a: (props: ComponentProps<"a">) => <Link {...props} />,
        //   table: (props: ComponentProps<"table">) => <Table {...props} />,
        //   section: (props: ComponentProps<"section">) => (
        //     <Section {...props} />
        //   ),
        //   img: (props: ComponentProps<"img">) => <Image {...props} />,
        //   pre: (props: ComponentProps<"pre">) => <CodeBlock {...props} />,
        //   /* Custom Components */
        //   ...COMPONENTS,
          __InvalidComponent__: (props: ComponentProps<"div">) => (
            <div>TODO INVALID!!</div>
          ),
        }}
        />
      );
    });
  }, [bundle.code]);

  return (
    <div className="max-w-none prose dark:prose-invert">
      <MDX />
    </div>
  );
}
