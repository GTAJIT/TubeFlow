export class ApiError extends Error{
    public isOperational : boolean
    public statusCode: number
    public success: boolean
    constructor(statusCode: number, message: string,success:boolean = false, isOperational=true, stack=""){
        super(message)
        this.statusCode = statusCode;
        this.success = false
        this.isOperational = isOperational;

        if(stack){
            this.stack = stack
        } else {
            Error.captureStackTrace(this, this.constructor)
        }

    }
}

export function BadRequest(message: string){
    throw new ApiError(400, message)
}
export function notFound(message: string){
    throw new ApiError(404, message)
}
export function internalServerError(message: string){
    throw new ApiError(500, message)
}