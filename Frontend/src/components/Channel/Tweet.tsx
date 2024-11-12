import React, { useEffect, useState } from "react";
import TweetCard from "./TweetCard"; // Import TweetCard component
import "../../styles/component_styles/tweet.css";
import api from "../../services/api";

function Tweet({channelId}: {channelId: string}) {
  // Sample data for tweets
  const [tweets, setTweets] = useState([
    {
      id: 0,
      username: "",
      avatar: "",
      content: "",
    }
  ]);

  const [newTweet, setNewTweet] = useState("");

  useEffect(()=>{
    api.get(`/tweet/all/${channelId}`)
    .then((res)=>{
      setTweets(res.data.result)
    })
  }, [channelId])

  const handleTweet = () => {
    if (newTweet.trim()) {
      const newTweetData = {
        id: tweets.length + 1,
        username: "new_user",
        avatar: "https://via.placeholder.com/40",
        content: newTweet,
      };
      setTweets([newTweetData, ...tweets]);
      setNewTweet("");
    }
  };

  return (
    <div className="tweet-container">
      <div className="input-container">
        <input
          type="text"
          className="input-field"
          placeholder="What's happening?"
          value={newTweet} // Link input to newTweet state
          onChange={(e) => setNewTweet(e.target.value)} // Update state on input
        />
        <button className="submit-button" onClick={handleTweet}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="currentColor"
            viewBox="0 0 30 30"
          >
            <path d="M ... (icon path)" />
          </svg>
        </button>
      </div>

      {tweets.map((tweet) => (
        <TweetCard
          key={tweet.id}
          avatar={tweet.avatar}
          username={tweet.username}
          content={tweet.content}
        />
      ))}
    </div>
  );
}

export default Tweet;
