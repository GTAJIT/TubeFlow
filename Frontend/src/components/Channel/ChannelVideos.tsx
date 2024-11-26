import { useEffect, useState } from "react";
import api from "../../services/api";
import "../../styles/component_styles/channelVideos.css";
import { Link } from "react-router-dom";

interface ChannelProps {
  id: string;
}

const ChannelVideos: React.FC<ChannelProps> = (props) => {
  const [videos, setVideos] = useState([
    {
        id: 0,
      title: "",
      thumbnail: "",
      views: 0
    }
  ]);

  useEffect(() => {
    api.get(`/video/${props.id}`)
      .then((res) => {
        setVideos(res.data.result);
      });
  }, [props.id]);

  return (
    <div className="videos-container">
      {videos.map((video, index) => (
        <div key={index} className="video-card">
        <Link to={`/video/${video.id}`}>
          <img src={video.thumbnail} alt="Thumbnail" className="video-thumbnail" />
        </Link>
          <p className="video-title">{video.title}</p>
          <p className="video-views">{video.views} views</p>
        </div>
      ))}
    </div>
  );
};

export default ChannelVideos;
