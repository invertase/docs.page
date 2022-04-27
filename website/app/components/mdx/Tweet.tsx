import { TwitterTweetEmbed } from 'react-twitter-embed';

export const Tweet = ({ id }: { id: string }) => {
  return (
    <figure className="tweet-container flex w-full items-center justify-center overflow-hidden">
      <TwitterTweetEmbed tweetId={id} />
    </figure>
  );
};
