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
    userId: string
};

export type Props = {
    videos: VideoProps[];
};