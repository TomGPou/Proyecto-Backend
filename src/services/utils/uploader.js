import multer from 'multer';
import config from '../../config.js';

const productStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, config.DIRNAME + '/public/img/products')
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
})
export const productUploader = multer({storage: productStorage});

const profileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, config.DIRNAME + '/public/img/profiles')
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
})
export const profileUploader = multer({storage: profileStorage});

const documentStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, config.DIRNAME + '/public/documents')
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
})
export const documentUploader = multer({storage: documentStorage});


