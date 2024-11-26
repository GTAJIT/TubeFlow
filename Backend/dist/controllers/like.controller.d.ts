declare const toggleVideoLike: (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => void;
declare const toggleCommentLike: (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => void;
declare const toggleTweetLike: (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => void;
declare const getLikedVideos: (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => void;
declare const getLikeById: (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => void;
export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos, getLikeById };
