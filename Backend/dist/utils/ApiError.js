"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = void 0;
exports.BadRequest = BadRequest;
exports.notFound = notFound;
exports.internalServerError = internalServerError;
class ApiError extends Error {
    constructor(statusCode, message, success = false, isOperational = true, stack = "") {
        super(message);
        this.statusCode = statusCode;
        this.success = false;
        this.isOperational = isOperational;
        if (stack) {
            this.stack = stack;
        }
        else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}
exports.ApiError = ApiError;
function BadRequest(message) {
    throw new ApiError(400, message);
}
function notFound(message) {
    throw new ApiError(404, message);
}
function internalServerError(message) {
    throw new ApiError(500, message);
}
