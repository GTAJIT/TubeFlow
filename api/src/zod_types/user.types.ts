import zod from 'zod'
export const userSchema = zod.object({
    username: zod.string(),
    email: zod.string().email(),
    password: zod.string(),
    fullName: zod.string(),
})