import { useEffect, useRef } from "react";
import { useExternalScript } from "~/hooks";

declare global {
  interface Window {
    twttr: {
      widgets: {
        createTweet: (
          tweetId: string,
          el: HTMLElement,
          options?: unknown,
        ) => Promise<void>;
      };
    };
  }
}

type TweetProps = {
  id: string;
  // String is legacy, boolean is new.
  cards?: string | boolean;
  conversation?: string | boolean;
};

export function Tweet(props: TweetProps) {
  const ref = useRef<HTMLDivElement>(null);
  const loaded = useExternalScript("https://platform.twitter.com/widgets.js");

  // String is legacy, boolean is new.
  const cards =
    props.cards === "hidden" ? "hidden" : !props.cards ? "hidden" : "";
  const conversation =
    props.conversation === "none" ? "none" : !props.conversation ? "none" : "";

  useEffect(() => {
    if (ref.current && loaded) {
      window.twttr.widgets.createTweet(props.id, ref.current, {
        dnt: true,
        align: "center",
        cards,
        conversation,
        theme:
          document.documentElement.getAttribute("data-theme") === "dark"
            ? "dark"
            : "light",
      });
    }
  }, [props.id, loaded, cards, conversation]);

  if (!props.id || !loaded) {
    return <div />;
  }

  return (
    <div
      ref={ref}
      className="[&>div]:mx-auto [&>div]:overflow-hidden [&>div]:rounded-[14px] [&>div]:border-[1px] [&>div]:border-solid [&>div]:border-gray-200 [&>div]:shadow [&>div]:hover:shadow-lg [&>div]:dark:border-zinc-800 my-6 mx-auto"
      data-tweet={props.id}
    />
  );
}
