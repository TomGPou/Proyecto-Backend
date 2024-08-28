import multer from "multer";

const productStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/public/img/products");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
export const productUploader = multer({ storage: productStorage });

const profileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/public/img/profiles");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
export const profileUploader = multer({ storage: profileStorage });

const documentStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/public/documents");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
export const documentUploader = multer({ storage: documentStorage });
