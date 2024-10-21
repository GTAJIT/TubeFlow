import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError";

const prisma = new PrismaClient();

export const generateAccessAndRefreshToken = async (userId: string) => {
  try {
    // Ensure the environment variables are present
    const accessTokenSecret = process.env.JWT_SECRET;
    const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
    const accessExpiry = process.env.JWT_EXPIRY;
    const refreshExpiry = process.env.REFRESH_EXPIRY;

    if (!refreshTokenSecret||!accessTokenSecret || !accessExpiry || !refreshExpiry) {
      throw new ApiError(500, "Missing environment variables");
    }

    // Generate the access and refresh tokens
    const accessToken: string = jwt.sign({ userId }, accessTokenSecret, {
      expiresIn: accessExpiry,
    });
    const refreshToken: string = jwt.sign({ userId }, refreshTokenSecret, {
      expiresIn: refreshExpiry,
    });

    // Update the refresh token in the database
    await prisma.user.update({
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
  } catch (err: any) {
    throw new ApiError(400, "Token Generation Problem: " + err.message);
  }
};
