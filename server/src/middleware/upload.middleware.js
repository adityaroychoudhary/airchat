import multer from "multer"

const MAX_FILE_SIZE = 1024 * 1024 * 25;

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fieldSize: MAX_FILE_SIZE
  },
  fileFilter: (req, file, cb) => {
    const isImage = file.mimetype.startsWith("image/");
    const isVideo = file.mimetype.startsWith("video/");

    if (!isImage && !isVideo) {
      return cb(new Error("Only images and videos are allowed"), false);
    }

    cb(null, true);
  }
})

export default upload;
