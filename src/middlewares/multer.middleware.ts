
import multer from 'multer';
import path from 'path';  // This is key for file extension handling
import fs from 'fs'
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/temp');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname); // Get the original file extension
    cb(null, path.basename(file.originalname, ext) + '-' + uniqueSuffix + ext); // Preserve the extension
  }
});

export const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});
export const videoUpload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if ((file.fieldname === 'thumbnail' && (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png')) ||
    (file.fieldname === 'video' && file.mimetype === 'video/mp4')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});
export const deleteFilePath = (localFilePath: string)=>{
  if(fs.existsSync(localFilePath)){
    fs.unlinkSync(localFilePath)
  }
}
