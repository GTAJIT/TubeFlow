"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = void 0;
// A higher-order function that wraps async route handlers to catch errors
const asyncHandler = (reqHandler) => {
    return (req, res, next) => {
        // Catch any errors thrown in the async function and pass them to the next() function
        reqHandler(req, res, next).catch((err) => next(err));
    };
};
exports.asyncHandler = asyncHandler;
