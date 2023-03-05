import React, { FunctionComponent } from 'react';
import { GeneralObserver } from './generalObserver';

const handleTwttrLoad = () => {
  if (!window.twttr) {
    createScriptTag(null, twttrEmbedScript);
    return {
      status: 'createScriptTag',
    };
  } else {
    twttrLoad();
    return {
      status: 'twttrLoad',
    };
  }
};

export const Tweet = ({
  tweetLink,
  theme = 'light',
  align = 'left',
  hideConversation = false,
}) => (
  <GeneralObserver onEnter={() => handleTwttrLoad()}>
    <div
      data-testid="twitter-tweet"
      className="twitter-tweet-mdx-embed"
      style={{ overflow: 'auto' }}
    >
      <blockquote
        className="twitter-tweet"
        data-theme={theme}
        data-align={align}
        data-conversation={hideConversation ? 'none' : ''}
      >
        <a href={`https://twitter.com/${tweetLink}?ref_src=twsrc%5Etfw`}>
          {typeof window !== 'undefined' && !window.twttr ? 'Loading' : ''}
        </a>
      </blockquote>
    </div>
  </GeneralObserver>
);
