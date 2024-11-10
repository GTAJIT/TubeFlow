export declare class ApiError extends Error {
    isOperational: boolean;
    statusCode: number;
    success: boolean;
    constructor(statusCode: number, message: string, success?: boolean, isOperational?: boolean, stack?: string);
}
export declare function BadRequest(message: string): void;
export declare function notFound(message: string): void;
export declare function internalServerError(message: string): void;
