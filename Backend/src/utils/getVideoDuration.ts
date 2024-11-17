import ffmpeg from 'fluent-ffmpeg'
const getVideoDuration = (videoUrl: string): Promise<number> =>
  new Promise((resolve, reject) => {
    ffmpeg(videoUrl)
      .ffprobe((err, data) => {
        if (err) return reject(err);
        const duration = data.format.duration;
        //@ts-ignore
        resolve(duration);
      });
  });


  export default getVideoDuration