declare const addComments: (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => void;
declare const getAllComments: (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => void;
declare const updateComments: (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => void;
declare const deleteComments: (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => void;
export { addComments, getAllComments, updateComments, deleteComments };
