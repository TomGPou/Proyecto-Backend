import config from "../../config.js";
import errorsDictionary from "./errrosDictionary.js";
import CustomError from "./CustomErrors.class.js";

const errorsHandler = (err, req, res, next) => {
  // Redireccion a login si usuario ya existe cuando se registra
  if (err instanceof CustomError && err.type === errorsDictionary.EMAIL_ALREADY_EXISTS) {
    req.logger.warning(
      `${new Date().toDateString()} ${new Date().toLocaleTimeString()} ${
        req.method
      } ${req.url} ${err.message}`
    )
    return res.redirect(`/login?error=${encodeURI(err.message)}`);
  }

  let customErr = errorsDictionary.UNHANDLED_ERROR;
  if (err instanceof CustomError) {
    for (const key in errorsDictionary) {
      if (errorsDictionary[key].code === err.type.code) {
        customErr = errorsDictionary[key];
        break;
      }
    }
  }

  switch (customErr.log) {
    case "fatal":
      req.logger.fatal(
        `${new Date().toDateString()} ${new Date().toLocaleTimeString()} ${
          req.method
        } ${req.url} ${err.message}`
      );
      break;
    case "error":
      req.logger.error(
        `${new Date().toDateString()} ${new Date().toLocaleTimeString()} ${
          req.method
        } ${req.url} ${err.message}`
      );
      break;
    case "warning":
      req.logger.warning(
        `${new Date().toDateString()} ${new Date().toLocaleTimeString()} ${
          req.method
        } ${req.url} ${err.message}`
      );
      break;
    case "info":
      req.logger.info(
        `${new Date().toDateString()} ${new Date().toLocaleTimeString()} ${
          req.method
        } ${req.url} ${err.message}`
      );
      break;
    case "http":
      req.logger.http(
        `${new Date().toDateString()} ${new Date().toLocaleTimeString()} ${
          req.method
        } ${req.url} ${err.message}`
      );
      break;
    case "debug":
      req.logger.debug(
        `${new Date().toDateString()} ${new Date().toLocaleTimeString()} ${
          req.method
        } ${req.url} ${err.message}`
      );
      break;
    default:
      req.logger.error(
        `${new Date().toDateString()} ${new Date().toLocaleTimeString()} ${
          req.method
        } ${req.url} ${err.message}`
      );
  }

  return res.status(customErr.status).send({
    origin: config.SERVER,
    payload: "",
    error: customErr.message,
  });
};
export default errorsHandler;
