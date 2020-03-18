const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');
const PORT = process.env.PORT || 666;
const app = express();

app.set('view engine', 'ejs');

/*
* make public folder
*/
app.use(express.static('./public'));
app.get('/', (req, res) => res.render('index'));
app.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    if(err){
      res.render('index', {
        msg: err
      });
    } else {
      if(req.file == undefined){
        res.render('index', {
          msg: 'You must choose a file '
        });
      } else {
        res.render('index', {
          msg: 'image succesfully updates',
          file: `uploads/${req.file.filename}`
        });
      }
    }
  });
});



app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));

/*
 * setting up multer storage engine.  
 * stores files in folder (public/uploads) => is made if not already in express static after init
 */
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function(req, file, cb){
    cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});
/*
 * upload object 
 */
const upload = multer({
  storage: storage,
  limits:{fileSize: 1000000},
  fileFilter: function(req, file, cb){
    checkFileType(file, cb);
  }
}).single('myImage');

/*
 * 
 * @param {*} file 
 * @param {*} cb 
 * function to check if filetpye is valid
 * can be set in const filetype = see multer documentation for available options 
 */
const checkFileType = (file, cb) =>{
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname){
    return cb(null,true);
  } else {
    cb('Error: Images Only!');
  }
}

