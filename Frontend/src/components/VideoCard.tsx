// VideoCard.tsx
import React from 'react';
import '../styles/channel.css';

type VideoProps = {
    id: number;
    videoFile: string;
    thumbnail: string;
    title: string;
    description: string;
    duration: number; // Duration in seconds
    views: number;
    isPublished: boolean;
    createdAt: string; // You might want to format this date
    updatedAt: string; // You might want to format this date
};

type Props = {
    videos: VideoProps[];
};

const VideoCard: React.FC<Props> = ({ videos }) => {
    return (
        <div className="video-grid">
            {videos.map((video) => (
                <div key={video.id} className="video-card">
                    <img
                        src={video.thumbnail}
                        alt={`Thumbnail for ${video.title}`}
                        className="video-thumbnail"
                    />
                    <div className="video-info">
                        <h2 className="video-title">{video.title}</h2>
                        <p className="video-description">{video.description}</p>
                        <p className="video-views">{video.views} views</p>
                        <p className="video-date">{new Date(video.createdAt).toLocaleDateString()}</p>
                        <p className="video-duration">{video.duration} min</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default VideoCard;
