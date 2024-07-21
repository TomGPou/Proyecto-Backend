import config from "../../config.js";
import errorsDictonary from "./errrosDictionary.js";

const errorsHandler = (error, req, res, next) => {
  let customErr = errorsDictonary[0];

  for (const key in errorsDictonary) {
    if (errorsDictonary[key].code === error.type.code)
      customErr = errorsDictonary[key];
  }
  
  return res.status(customErr.status).send({
    origin: config.SERVER,
    payload: "",
    error: customErr.message,
  });
};

export default errorsHandler;
