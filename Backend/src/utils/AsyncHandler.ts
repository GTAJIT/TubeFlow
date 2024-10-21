import { Request, Response, NextFunction } from "express";

// A higher-order function that wraps async route handlers to catch errors
const asyncHandler = (reqHandler: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        // Catch any errors thrown in the async function and pass them to the next() function
        reqHandler(req, res, next).catch((err) => next(err));
    };
};

export { asyncHandler };
