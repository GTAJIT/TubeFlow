declare const uploadOnCloudinary: (localFilePath: string) => Promise<string | null>;
declare const deleteOldImage: (linkOfPath: string) => Promise<any>;
declare const deleteOldVideo: (linkOfPath: string) => Promise<any>;
export { uploadOnCloudinary, deleteOldImage, deleteOldVideo };
