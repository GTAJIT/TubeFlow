"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAccessAndRefreshToken = void 0;
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ApiError_1 = require("../utils/ApiError");
const prisma = new client_1.PrismaClient();
const generateAccessAndRefreshToken = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Ensure the environment variables are present
        const accessTokenSecret = process.env.JWT_SECRET;
        const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
        const accessExpiry = process.env.JWT_EXPIRY;
        const refreshExpiry = process.env.REFRESH_EXPIRY;
        if (!refreshTokenSecret || !accessTokenSecret || !accessExpiry || !refreshExpiry) {
            throw new ApiError_1.ApiError(500, "Missing environment variables");
        }
        // Generate the access and refresh tokens
        const accessToken = jsonwebtoken_1.default.sign({ userId }, accessTokenSecret, {
            expiresIn: accessExpiry,
        });
        const refreshToken = jsonwebtoken_1.default.sign({ userId }, refreshTokenSecret, {
            expiresIn: refreshExpiry,
        });
        // Update the refresh token in the database
        yield prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                refreshToken: refreshToken,
            },
        });
        // Return both tokens
        return {
            accessToken,
            refreshToken,
        };
    }
    catch (err) {
        throw new ApiError_1.ApiError(400, "Token Generation Problem: " + err.message);
    }
});
exports.generateAccessAndRefreshToken = generateAccessAndRefreshToken;
