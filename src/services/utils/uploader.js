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
  destination: (req, file, cb) => {
    if (file.fieldname === "profile") {
      cb(null, "src/public/img/profiles");
    } else if (file.fieldname === "id" || file.fieldname === "address" || file.fieldname === "account") {
      cb(null, "src/public/documents");
    } else {
      throw new CustomError(errorsDictionary.INVALID_FILE)
    }
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
});
export  const userUploader = multer({ storage: userStorage });


