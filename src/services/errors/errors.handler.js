import config from "../../config.js";
import errorsDictionary from "./errrosDictionary.js";
import CustomError from "./CustomErrors.class.js";

const errorsHandler = (err, req, res, next) => {
  let customErr = errorsDictionary.UNHANDLED_ERROR;
  if (err instanceof CustomError) {
    for (const key in errorsDictionary) {
      if (errorsDictionary[key].code === err.type.code) {
        customErr = errorsDictionary[key];
        break;
      }
    }
  }
  return res.status(customErr.status).send({
    origin: config.SERVER,
    payload: "",
    error: customErr.message,
  });
};
export default errorsHandler;
