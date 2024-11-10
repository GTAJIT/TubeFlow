import zod from 'zod';
declare const registrationSchema: zod.ZodObject<{
    username: zod.ZodString;
    email: zod.ZodString;
    password: zod.ZodString;
    fullName: zod.ZodString;
}, "strip", zod.ZodTypeAny, {
    username: string;
    email: string;
    fullName: string;
    password: string;
}, {
    username: string;
    email: string;
    fullName: string;
    password: string;
}>;
declare const loginSchema: zod.ZodObject<{
    username: zod.ZodString;
    email: zod.ZodString;
    password: zod.ZodString;
}, "strip", zod.ZodTypeAny, {
    username: string;
    email: string;
    password: string;
}, {
    username: string;
    email: string;
    password: string;
}>;
declare const passwordSchema: zod.ZodObject<{
    oldPassword: zod.ZodString;
    newPassword: zod.ZodString;
}, "strip", zod.ZodTypeAny, {
    oldPassword: string;
    newPassword: string;
}, {
    oldPassword: string;
    newPassword: string;
}>;
declare const updateUsernameSchema: zod.ZodObject<{
    username: zod.ZodString;
}, "strip", zod.ZodTypeAny, {
    username: string;
}, {
    username: string;
}>;
export { registrationSchema, loginSchema, passwordSchema, updateUsernameSchema };
