import { TwitterTweetEmbed } from 'react-twitter-embed';

interface TweetProps {
  /*
  The numerical ID of the desired Tweet.	
  */
  id?: string;
  /*
  When set to hidden, links in a Tweet are not expanded to photo, video, or link previews.	
  */
  cards: string;
  /*
  When set to none, only the cited Tweet will be displayed even if it is in reply to another Tweet.
  */
  conversation: string;
  /*
  When set to dark, displays Tweet with light text over a dark background.
  */
  theme: string;
  /*
  The maximum width of the rendered Tweet in whole pixels. This value should be between 250 and 550 pixels.
  */
  width: number;
  /*
  Float the Tweet left, right, or center relative to its container.
  */
  align: 'left' | 'right' | 'center';
  /*
  A supported Twitter language code. Note: doesn't change text of actual tweet.
  */
  lang: string;
  /*
  When set to true, the Tweet and its embedded page on your site are not used for purposes that
  include personalized suggestions and personalized ads.
   */
  dnt: boolean;
}

export const Tweet = (props: TweetProps) => {
  const id = props.id;

  if (!id) {
    return <></>;
  }

  return (
    <figure className="tweet-container flex w-full items-center justify-center overflow-hidden">
      <TwitterTweetEmbed
        tweetId={id}
        options={{
          ...props,
          cards: props.cards || 'hidden',
          conversation: props.conversation || 'none',
          dnt: props.dnt || true,
          width: props.width || 550,
        }}
      />
    </figure>
  );
};
