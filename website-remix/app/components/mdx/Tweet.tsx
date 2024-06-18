type TweetProps = {
  id: string;
  // String is legacy, boolean is new.
  cards: string | boolean;
  conversation: string | boolean;
};

export function Tweet(props: TweetProps) {
  if (!props.id) {
    return <div />;
  }

  const cards = props.cards ? props.cards : false;
  const conversation = props.conversation ? props.conversation : false;

  return (
    <div
      className="[&>div]:mx-auto [&>div]:overflow-hidden [&>div]:rounded-[14px] [&>div]:border-[1px] [&>div]:border-solid [&>div]:border-gray-200 [&>div]:shadow [&>div]:hover:shadow-lg [&>div]:dark:border-zinc-800 my-6 mx-auto"
      data-tweet
      data-tweet-id={props.id}
      data-tweet-cards={cards === 'hidden' ? 'false' : `${cards}`}
      data-tweet-conversation={conversation === 'none' ? 'false' : `${conversation}`}
    />
  );
}
