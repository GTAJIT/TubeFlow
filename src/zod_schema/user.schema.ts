import zod from 'zod'
const registrationSchema = zod.object({
    username: zod.string(),
    email: zod.string().email(),
    password: zod.string().min(8),
    fullName: zod.string()
});
const loginSchema = zod.object({
    username: zod.string(),
    email: zod.string().email(),
    password: zod.string().min(8),
});
const passwordSchema = zod.object({
    oldPassword: zod.string(),
    newPassword: zod.string()
})
const updateUsernameSchema = zod.object({
    username: zod.string()
})

export {
    registrationSchema,
    loginSchema,
    passwordSchema,
    updateUsernameSchema
}