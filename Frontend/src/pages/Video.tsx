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
  const [comment, setComment] = useState([
    {
      id: 0,
      content: "",
      userId: "",
      likes: 0,
      username: {
        username: "",
        avatar: "",
      },
    },
  ]);

  const [subscriberCount, setSubscriberCount] = useState(0);
  const [addComment, setAddComment] = useState("");
  useEffect(() => {
    if (!video.userId) return;

    const fetchChannelDetails = async () => {
      try {
        const channelRes = await api.get(
          `/user/get-user-by-id/${video.userId}`
        );
        setChannelDetails(channelRes.data.result);

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
  // Fetch video details and like count
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const videoRes = await api.get(`/video/get-video/${id}`);
        setVideo(videoRes.data.result);

        const likeRes = await api.get(`/like/video/${id}`);
        setLikeCount(likeRes.data.likeCount);
      
        const subsRes = await api.get(`/user/c/${channelDetails.username}`)
        // console.log(subsRes.data  )
        setSubscriberCount(subsRes.data.subscribers)

        const commentRes = await api.get(`/comment/all/${video.id}?limit=10`);
        console.log(commentRes.data);
        setComment(commentRes.data.commentDetails || []);
      } catch (error) {
        console.error("Error fetching video data:", error);
      }
    };

    fetchData();
  }, [id, video.userId, channelDetails]);

  // Fetch channel details and check subscription status
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
      setSubscriberCount((prevCount) =>
        res.data.message === "Subscribed" ? prevCount + 1 : prevCount - 1
      );
    } catch (error) {
      console.error("Error toggling subscription:", error);
    }
  };
  //@ts-ignore
  const handleComment = async () => {
    const res = await api.post(`/comment/add/${video.id}`, {
      comment: addComment,
    });
    const newComment = 
    {
      id: res.data.id,
      content: res.data.content,
      userId: res.data.userId,
      likes: res.data.likes,
      username: {
        username: res.data.userDetails.username,
        avatar: res.data.userDetails.avatar,
      },
    }
    
    setAddComment("")
    setComment((prev)=>[...prev, newComment])
  };
  //@ts-ignore
  const handleCommentLike = async(e)=>{
    // console.log(e.target.value)
    const commentId =e.target.value
    const res = await api.post(`/like/toggle/c/${commentId}`)
    
      setComment((prevComment)=>(
        prevComment.map((comment)=>(
          comment.id == commentId ? 
          {
          ...comment,
          likes: res.data.message == "Comment Liked"? comment.likes+1 : comment.likes-1
          }
          : comment
        ))
      ))
  }
  
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
            value={addComment}
            onChange={(e) => {
              setAddComment(e.target.value);
            }}
          />
          <button className="comment-submit" onClick={handleComment}>
            Comment
          </button>
        </div>
        <div className="comments-list">
          {comment.map((item, index) => (
            <div className="comment" key={index}>
              <div className="comment-avatar">
                <img
                  src={
                    item.username?.avatar || "https://via.placeholder.com/40"
                  }
                  alt="User Avatar"
                />
              </div>
              <div className="comment-content">
                <p className="comment-user">
                  {item.username?.username || "Unknown User"}{" "}
                  <span className="comment-date">2 days ago</span>
                </p>
                <p className="comment-text">{item.content}</p>
                <div className="comment-actions">
                  <button onClick={handleCommentLike} value={item.id}>👍 Like({item.likes})</button>
                  <button>Reply</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export { Video };
