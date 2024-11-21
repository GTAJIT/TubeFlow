import { Context } from "hono"
import { getPrisma } from "../db/db"
import { userSchema } from "../zod_types/user.types" 
import { ApiResponse } from "../utils/ApiResponse"
import { ApiError } from "../utils/ApiError"

const registerHandler = async (c: Context)=>{
    const prisma = getPrisma(c.env.DATABASE_URL)
    const body = await c.req.json()
    const {success, data} = userSchema.safeParse(body)
    // console.log(data, success)
    if(!success) {
        throw new ApiError(400, "Invalid Input")
    }

    // const result = await prisma.user.create({
    //     data:{
    //         username: "sdf",
    //         fullName:"sdf",
    //         email: "SDF",
    //         password: "SDF",
    //         avatar: "SDF",
    //         coverImage: "SDF",
    //         refreshToken: "SDF"
    //     }
    // })
    return ApiResponse(200, "Good Type");
}

export {
    registerHandler
}