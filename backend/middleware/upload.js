const multer = require("multer");
const path = require("path");


const storage = multer.memoryStorage();


const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif/;
  const extname = allowed.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowed.test(file.mimetype);
  if (extname && mimetype) cb(null, true);
  else cb(new Error("Only image files are allowed!"));
};


const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, 
});


const convertToBase64 = (file) => {
  if (!file) return null;
  const base64 = file.buffer.toString("base64");
  return `data:${file.mimetype};base64,${base64}`;
};

module.exports = { upload, convertToBase64 };


 