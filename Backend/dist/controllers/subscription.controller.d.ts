declare const getUserChannelSubscribers: (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => void;
declare const toggleSubscription: (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => void;
declare const getSubscribedChannels: (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => void;
export { getUserChannelSubscribers, toggleSubscription, getSubscribedChannels };
