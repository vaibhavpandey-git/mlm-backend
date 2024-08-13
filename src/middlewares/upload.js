const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        return cb(null, '.././public/uploads');
    },
    filename: (req, file, cb)=>{
        const {userId} = req.body;
        return cb(null, `${Date.now()}_${userId}_${file.originalname}`);
    }
});
console.log('yha tk aaya')
const upload = multer({storage});

module.exports = upload