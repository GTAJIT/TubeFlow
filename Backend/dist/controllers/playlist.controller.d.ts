declare const createPlaylist: (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => void;
declare const getUserPlaylists: (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => void;
declare const getPlaylistById: (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => void;
declare const addVideoToPlaylist: (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => void;
declare const removeVideoFromPlaylist: (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => void;
declare const deletePlaylist: (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => void;
declare const updatePlaylist: (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => void;
export { createPlaylist, getUserPlaylists, getPlaylistById, addVideoToPlaylist, removeVideoFromPlaylist, deletePlaylist, updatePlaylist, };
