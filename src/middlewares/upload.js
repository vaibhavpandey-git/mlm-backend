const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, ".././uploads");
  },
  filename: function (req, file, cb) {
    const uniqueNum = Math.floor(10000000 + Math.random() * 90000000);
    const originalFileName = file.originalname.replace(/\s+/g, '-');

    cb(null, `${uniqueNum}_${Date.now()}_${originalFileName}`);
  },
});

const upload = multer({ storage });

module.exports = upload;