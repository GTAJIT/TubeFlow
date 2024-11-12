import React from 'react';
import '../../styles/component_styles/tweet.css'

//@ts-ignore
function TweetCard({ avatar, username, content }) {
  return (
    <div className="tweet-card">
      <img src={avatar} alt={`${username} avatar`} className="avatar" />
      <div className="tweet-content">
        <div className="username">{username}</div>
        <p>{content}</p>
      </div>
    </div>
  );
}

export default TweetCard;
