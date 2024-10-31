// Video.tsx
import { useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import videoContext from '../context/videodetails.atom';
import '../styles/video.css';

const Video = () => {
  const { id } = useParams<{ id: string }>();
  if (!id) return <>No Id Found</>;

  const videos = useRecoilValue(videoContext);
  const video = videos.find((v) => v.id === parseInt(id));
  if (!video) return <p>Video not found</p>;

  return (
    <div className="video-container">
      <div className="video-player-wrapper">
        <video src={video.videoFile} controls className="video-player" />
      </div>
      <div className="video-info">
        <h2>{video.title}</h2>
        <div className="video-metadata">
          <p className="video-views">{video.views} views</p>
          <p className="video-date">{new Date(video.createdAt).toLocaleDateString()}</p>
        </div>
        <div className="video-action-buttons">
          <button>👍 Like</button>
          <button>Share</button>
          <button>Save</button>
        </div>
        <p className="video-description">{video.description}</p>
        <p>Duration: {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')} min</p>
      </div>

      {/* Comments Section */}
      <div className="comments-section">
        <h3>Comments</h3>
        <div className="comment-box">
          <textarea placeholder="Add a public comment..." />
          <button className="comment-submit">Comment</button>
        </div>
        <div className="comments-list">
          {/* Example Comment */}
          <div className="comment">
            <div className="comment-avatar">
              <img src="https://via.placeholder.com/40" alt="User Avatar" />
            </div>
            <div className="comment-content">
              <p className="comment-user">User1 <span className="comment-date">2 days ago</span></p>
              <p className="comment-text">This is a sample comment to demonstrate the layout.</p>
              <div className="comment-actions">
                <button>👍 Like</button>
                <button>Reply</button>
              </div>
            </div>
          </div>
          {/* Add more comments as needed */}
        </div>
      </div>
    </div>
  );
};

export default Video;
