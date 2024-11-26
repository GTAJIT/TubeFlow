// VideoCard.tsx
import React from "react";
import "../styles/channel.css";
import { Link, useNavigate } from "react-router-dom";
import { Props } from "../types/video.types";

const VideoCard: React.FC<Props> = ({ videos }) => {
  const navigate = useNavigate();
  return (
    <div className="video-grid">
      {videos.map((video) => (
        <div key={video.id} className="video-card">
          <Link
            to={`/video/${video.id}`}
            key={video.id}
            style={{ textDecoration: "none" }}
          >
            <img
              src={video.thumbnail}
              alt={`Thumbnail for ${video.title}`}
              className="video-thumbnail"
            />
          </Link>
          <div className="video-info">
            <h2 className="video-title">{video.title}</h2>
            <p className="video-description">{video.description}</p>
            <p className="video-views">{video.views} views</p>

            <p
              className="video-username"
              onClick={() => navigate(`/channel/${video.username}`)}
            >
              {video.username}
            </p>
            <p className="video-date">
              {new Date(video.createdAt).toLocaleDateString()}
            </p>
            <p className="video-duration">{video.duration} secs</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VideoCard;
