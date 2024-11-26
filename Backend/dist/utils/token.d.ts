export declare const generateAccessAndRefreshToken: (userId: string) => Promise<{
    accessToken: string;
    refreshToken: string;
}>;
