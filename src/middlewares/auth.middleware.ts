
import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { ApiError } from '../utils/ApiError';
interface TokenInterface {
    userId: string
}
export const verifyJWT = async (req: Request, res: Response, next: NextFunction)=>{
    try {
        const token = req.headers.authorization?.split(" ")[1] || req.cookies.accessToken;
        console.log(token)  
        if(!token) 
            throw new ApiError(401, "Unauthorized Request")
        if(!process.env.JWT_SECRET){
            return;
        }
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        
        req.userId = (decode as TokenInterface).userId
    
        next()
    } catch (error: any) {
        throw new ApiError(401, error)
    }
}   