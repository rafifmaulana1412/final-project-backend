const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

// Cloudinary otomatis baca dari process.env.CLOUDINARY_URL
cloudinary.config();

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "menus",
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

const upload = multer({ storage });
module.exports = upload;
