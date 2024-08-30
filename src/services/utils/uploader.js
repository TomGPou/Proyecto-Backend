import multer from "multer";
import CustomError from "../errors/CustomErrors.class.js";
import errorsDictionary from "../errors/errrosDictionary.js";

const productStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/public/img/products");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
export const productUploader = multer({ storage: productStorage });

const userStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log(file);
    // cb(null);
    // if (file.fieldname === "profile") {
    cb(null, "src/public/img/profile");
    // } else {
    //   cb(null, "src/public/documents");
    // }
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
export const userUploader = multer({ storage: userStorage });
