import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/video.css";

const Video = () => {
  const { id } = useParams<{ id: string }>();
  const [video, setVideo] = useState({
    id: 0,
    videoFile: "",
    title: "",
    description: "",
    duration: 0,
    views: 0,
    createdAt: "",
    userId: "",
  });

  const [channelDetails, setChannelDetails] = useState({
    avatar: "",
    username: "",
    fullName: "",
  });

  const [likeCount, setLikeCount] = useState(0);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriberCount, setSubscriberCount] = useState(0);
  // Fetch video details and like count
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const videoRes = await api.get(`/video/get-video/${id}`);
        setVideo(videoRes.data.result);

        const likeRes = await api.get(`/like/video/${id}`);
        setLikeCount(likeRes.data.likeCount);

        const subsRes = await api.get(
          `/subscription/get-subscribers/${video.userId}`
        );
        // console.log(subsRes.data.existingChannel)
        // setSubscriberCount(subsRes.data)
        setSubscriberCount(subsRes.data.existingChannel.length);
      } catch (error) {
        console.error("Error fetching video data:", error);
      }
    };

    fetchData();
  }, [id, video.userId]);

  // Fetch channel details and check subscription status
  useEffect(() => {
    if (!video.userId) return;

    const fetchChannelDetails = async () => {
      try {
        const channelRes = await api.get(
          `/user/get-user-by-id/${video.userId}`
        );
        setChannelDetails(channelRes.data.result);

        // Get the current user details to check subscription
        const userRes = await api.get("/user/get-current-user");

        const subscriptionRes = await api.get(
          `/subscription/get-subscribed-channels/${userRes.data.user.id}`
        );
        const isSubscribedToChannel =
          subscriptionRes.data.existingSubscriber.some(
            //@ts-ignore
            (sub) => sub.channelId === video.userId
          );
        setIsSubscribed(isSubscribedToChannel);
      } catch (error) {
        console.error("Error fetching channel details:", error);
      }
    };

    fetchChannelDetails();
  }, [video.userId]);

  // Like button handler
  const handleLike = async () => {
    try {
      const res = await api.post(`/like/toggle/v/${video.id}`);
      setLikeCount((prevCount) =>
        res.data.message === "Liked" ? prevCount + 1 : prevCount - 1
      );
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  // Subscribe/Unsubscribe button handler
  const handleSubscription = async () => {
    try {
      const res = await api.post(
        `/subscription/toggle-subscription/${video.userId}`
      );
      setIsSubscribed(res.data.message === "Subscribed");
    } catch (error) {
      console.error("Error toggling subscription:", error);
    }
  };

  return (
    <div className="video-container">
      <div className="video-player-wrapper">
        <video src={video.videoFile} controls className="video-player" />
      </div>
      <div className="video-info">
        <h2 className="video-title">{video.title}</h2>
        <div className="video-metadata">
          <p className="video-views">{video.views} views</p>
          <p className="video-date">
            {new Date(video.createdAt).toLocaleDateString()}
          </p>
        </div>
        <p className="video-description">{video.description}</p>

        {/* Channel Info Section */}
        <div className="channel-info">
          <div className="channel-avatar">
            <img src={channelDetails.avatar} alt="User Avatar" />
          </div>
          <div className="channel-details">
            <p className="channel-name">{channelDetails.fullName}</p>
            <span className="subscriber-count">
              {subscriberCount} subscribers
            </span>
          </div>
          <button
            className={`subscribe-button ${isSubscribed ? "subscribed" : ""}`}
            onClick={handleSubscription}
          >
            {isSubscribed ? "Subscribed" : "Subscribe"}
          </button>
        </div>

        {/* Action Buttons */}
        <div className="video-action-buttons">
          <button onClick={handleLike}>
            👍 Like <span>({likeCount})</span>
          </button>
          <button>Share</button>
          <button>Save</button>
        </div>
      </div>

      {/* Comments Section */}
      <div className="comments-section">
        <h3>Comments</h3>
        <div className="comment-box">
          <textarea
            placeholder="Add a public comment..."
            className="comment-input"
          />
          <button className="comment-submit">Comment</button>
        </div>
        <div className="comments-list">
          {/* Example Comment */}
          <div className="comment">
            <div className="comment-avatar">
              <img src="https://via.placeholder.com/40" alt="User Avatar" />
            </div>
            <div className="comment-content">
              <p className="comment-user">
                User1 <span className="comment-date">2 days ago</span>
              </p>
              <p className="comment-text">
                This is a sample comment to demonstrate the layout.
              </p>
              <div className="comment-actions">
                <button>👍 Like</button>
                <button>Reply</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Video;
