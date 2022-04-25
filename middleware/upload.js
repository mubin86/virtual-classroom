const path = require('path');
const multer = require('multer');
const AppError = require('../utils/appError');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      let ext = path.extname(file.originalname)
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
})
  
const upload = multer({
       storage: storage,
      //**   !file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG)$/       validator check*/    
       fileFilter: function(req, file, callback) {
            if(file.mimetype == "image/png" || 
                file.mimetype == "image/jpg" || 
                file.mimetype == "image/jpeg" ||
                file.mimetype.split("/")[1] === "pdf"
            ){
                callback(null, true);
            } else{
                console.log("only pdf and image are alloewd to upload");
                callback(new AppError("Only pdf and image are allowd to upload", 400), false);
            }
       },
       limits: {
           fileSize: 1024 * 1024 * 10
       }
});


module.exports = upload;