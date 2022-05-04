import { useEffect, useState, useRef, useContext } from 'react';
import { DarkModeContext } from '~/context';
interface TweetProps {
  /*
  The numerical ID of the desired Tweet.	
  */
  id: string;
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

declare global {
  interface Window {
    twttr: {
      widgets: {
        createTweet: (tweetId: string, el: HTMLElement, options: TweetProps) => Promise<void>;
      };
    };
  }
}

export function Tweet(props: TweetProps) {
  const [isLoading, setIsLoading] = useState(true);
  const elementRef = useRef<HTMLDivElement | null>(null);
  const { darkModeValue } = useContext(DarkModeContext);
  useEffect(() => {
    if (window.twttr && elementRef.current) {
      window.twttr.widgets
        .createTweet(props.id, elementRef.current, {
          ...props,
          cards: props.cards || 'hidden',
          conversation: props.conversation || 'none',
          dnt: props.dnt || true,
          width: props.width || 550,
          align: props.align || 'center',
          theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light',
        })
        .then(() => {
          setIsLoading(false);
        });
    }
  }, [props.id]);

  useEffect(() => {
    if (elementRef.current) {
      const iframe = elementRef.current.firstChild?.firstChild as HTMLIFrameElement;
      if (iframe && darkModeValue !== 'system') {
        const oldSrc = iframe.src;
        const notTheme = darkModeValue === 'dark' ? 'light' : 'dark';

        if (oldSrc.includes(notTheme)) {
          const newSrc = iframe.src.replace(notTheme, darkModeValue);
          iframe.src = newSrc;
        }
      }
    }
  }, [darkModeValue]);

  return (
    <div ref={elementRef} className={`tweet-container`}>
      {isLoading && <LoadingTweet />}
    </div>
  );
}

interface TweetProps {
  tweetID: string;
}

const LoadingTweet = () => <></>;
