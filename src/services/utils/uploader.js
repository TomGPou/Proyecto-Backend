import multer from "multer";
import CustomError from "../errors/CustomErrors.class.js";
import errorsDictionary from "../errors/errrosDictionary.js";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === "product")
      cb(null, `src/public/products`);
    else if (file.fieldname === "profile")
      cb(null, `src/public/profiles`);
    else if (['id', 'address', 'account'].includes(file.fieldname))
      cb(null, `src/public/documents`);
    else cb(new CustomError(errorsDictionary.INVALID_FILE))
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
export const uploader = multer({ storage: storage });
