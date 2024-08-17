const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, ".././public/uploads");
  },
  filename: function (req, file, cb) {
    const uniqueNum = Math.floor(10000000 + Math.random() * 90000000);
    console.log(uniqueNum);
    cb(null, `${uniqueNum}_${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage });

module.exports = upload;