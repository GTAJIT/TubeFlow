declare const createTweet: (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => void;
declare const getUserTweets: (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => void;
declare const updateTweet: (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => void;
declare const deleteTweet: (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => void;
export { createTweet, getUserTweets, updateTweet, deleteTweet };
