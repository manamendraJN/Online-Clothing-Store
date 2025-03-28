const multer = require('multer');

// config user storage in server
const userStorage = multer.diskStorage({
    destination: (req, file, cb) => { // add des to store image
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // save image as name with date
    },
});


//filter user image
const filterUser = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png'];//check image type to input
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};


//upload user image 
const userUpload = multer({ storage: userStorage, fileFilter: filterUser }).single('imagePath')

module.exports = { userUpload };
