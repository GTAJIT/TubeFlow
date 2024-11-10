import {Request} from "express"
declare global {
  namespace Express {
    interface Request {
      userId?: string; // Adjust the type as needed, depending on how you handle userId (string, number, etc.)
    }
  }
}

export {}