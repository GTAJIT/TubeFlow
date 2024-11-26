import { NextFunction, Request, Response } from 'express';
export declare const verifyJWT: (req: Request, res: Response, next: NextFunction) => Promise<void>;
