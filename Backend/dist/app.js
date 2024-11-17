"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const app = (0, express_1.default)();
dotenv_1.default.config();
app.use(express_1.default.json({ limit: "16kb" }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static("public"));
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow Authorization header
    credentials: true // If using cookies or session-based auth
}));
app.use((0, morgan_1.default)('dev'));
app.use((0, cookie_parser_1.default)());
//routes
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const video_routes_1 = __importDefault(require("./routes/video.routes"));
const subscription_routes_1 = __importDefault(require("./routes/subscription.routes"));
const tweet_routes_1 = __importDefault(require("./routes/tweet.routes"));
const comment_routes_1 = __importDefault(require("./routes/comment.routes"));
const like_routes_1 = __importDefault(require("./routes/like.routes"));
const playlist_routes_1 = __importDefault(require("./routes/playlist.routes"));
const dashboard_routes_1 = __importDefault(require("./routes/dashboard.routes"));
app.use("/api/v1/user", user_routes_1.default);
app.use('/api/v1/video', video_routes_1.default);
app.use('/api/v1/subscription', subscription_routes_1.default);
app.use('/api/v1/tweet', tweet_routes_1.default);
app.use('/api/v1/comment', comment_routes_1.default);
app.use('/api/v1/like', like_routes_1.default);
app.use("/api/v1/playlist", playlist_routes_1.default);
app.use("/api/v1/dashboard", dashboard_routes_1.default);
exports.default = app;
