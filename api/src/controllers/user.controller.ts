import { Context } from "hono";
import { getPrisma } from "../db/db";
import { userSchema } from "../zod_types/user.types";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { encodeBase64 } from "hono/utils/encode";
import { v2 as cloudinary } from "cloudinary";

const registerHandler = async (c: Context) => {
    console.log(c.env)
  const prisma = getPrisma(c.env.DATABASE_URL);

  const body = await c.req.parseBody();
  const { success, data } = userSchema.safeParse(body);
  // console.log(data, success)
  const avatar = body["avatar"] as File;
  const coverImage = body["coverImage"] as File;
  // console.log(files)
  if (!success) {
    throw new ApiError(400, "Invalid Input");
  }
  if (!avatar && !coverImage) {
    throw new ApiError(400, "No files uploaded");
  }

  //Image conversion section
  const byteArrayBuffer = await avatar.arrayBuffer();
  const base64 = encodeBase64(byteArrayBuffer);
  const avatarUploadResult = await cloudinary.uploader.upload(
    `data:image/png;base64,${base64}`
  );

  if (!avatarUploadResult)
    throw new ApiError(400, "Can't able to upload avatar");
  //CoverImage  conversion section
  const coverImagebyteArrayBuffer = await avatar.arrayBuffer();
  const coverImageBase64 = encodeBase64(coverImagebyteArrayBuffer);
  const coverImageUploadResult = await cloudinary.uploader.upload(
    `data:image/png;base64,${coverImageBase64}`
  );

  if (!coverImageUploadResult)
    throw new ApiError(400, "Can't able to upload cover image");
  const result = await prisma.user.create({
    data: {
      username: data.username,
      fullName: data.fullName,
      email: data.email,
      password: data.password,
      avatar: avatarUploadResult.secure_url,
      coverImage: coverImageUploadResult.secure_url,
      refreshToken: "",
    },
  });
  return ApiResponse(200, "Good Type");
};

export { registerHandler };
