const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Tentukan direktori upload
const uploadDir = path.join(__dirname, "../uploads");

// Pastikan folder uploads ada
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("📁 Folder 'uploads' dibuat di:", uploadDir);
}

// Konfigurasi multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // simpan file di folder uploads
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileName = uniqueSuffix + path.extname(file.originalname);
    cb(null, fileName); // nama file unik
  },
});

// Inisialisasi multer
const upload = multer({ storage });

module.exports = upload;
