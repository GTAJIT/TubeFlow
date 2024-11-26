import { Request, Response, NextFunction } from "express";
declare const asyncHandler: (reqHandler: (req: Request, res: Response, next: NextFunction) => Promise<any>) => (req: Request, res: Response, next: NextFunction) => void;
export { asyncHandler };
