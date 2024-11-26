"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUsernameSchema = exports.passwordSchema = exports.loginSchema = exports.registrationSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const registrationSchema = zod_1.default.object({
    username: zod_1.default.string(),
    email: zod_1.default.string().email(),
    password: zod_1.default.string().min(8),
    fullName: zod_1.default.string()
});
exports.registrationSchema = registrationSchema;
const loginSchema = zod_1.default.object({
    username: zod_1.default.string(),
    email: zod_1.default.string().email(),
    password: zod_1.default.string().min(8),
});
exports.loginSchema = loginSchema;
const passwordSchema = zod_1.default.object({
    oldPassword: zod_1.default.string(),
    newPassword: zod_1.default.string()
});
exports.passwordSchema = passwordSchema;
const updateUsernameSchema = zod_1.default.object({
    username: zod_1.default.string()
});
exports.updateUsernameSchema = updateUsernameSchema;
