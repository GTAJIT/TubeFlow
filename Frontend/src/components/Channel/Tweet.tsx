import { useEffect, useState } from "react";
import TweetCard from "./TweetCard"; // Import TweetCard component
import "../../styles/component_styles/tweet.css";
import api from "../../services/api";

function Tweet({ channelId }: { channelId: string }) {
  const [tweets, setTweets] = useState<
    { id: number; username: string; avatar: string; content: string }[]
  >([]);
  const [newTweet, setNewTweet] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTweets = async () => {
      try {
        const res = await api.get(`/tweet/all/${channelId}`);
        setTweets(res.data.result);
      } catch (err) {
        setError("Failed to load tweets");
      }
    };
    fetchTweets();
  }, [channelId]);

  const handleTweet = async () => {
    if (!newTweet.trim()) {
      setError("Tweet content cannot be empty.");
      return;
    }

    try {
      const result = await api.post("/tweet/create", {
        tweet: newTweet,
      });

      if (result.status === 200) {
        const newTweetData = {
          id: result.data.id, // Assuming API returns the new tweet's ID
          username: tweets[0].username, // Assuming API returns user details
          avatar: tweets[0].avatar,
          content: newTweet,
        };

        setTweets([newTweetData, ...tweets]); // Prepend new tweet
        setNewTweet(""); // Clear input field
        setError(""); // Clear any previous error
      } else {
        setError("Error posting tweet");
      }
    } catch (err) {
      setError("Failed to post tweet");
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

      {error && <p className="error-message">{error}</p>} {/* Display error */}

      {/* Sort tweets by ID (assumed descending) and render */}
      {tweets
        .sort((a, b) => b.id - a.id)
        .map((tweet) => (
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
