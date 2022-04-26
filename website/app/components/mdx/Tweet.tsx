import { TwitterTweetEmbed } from 'react-twitter-embed';

export const Tweet = ({ id }: { id: string }) => {
  return (
    <figure className="flex w-full items-center justify-center">
      <TwitterTweetEmbed tweetId={id} />
    </figure>
  );
};
