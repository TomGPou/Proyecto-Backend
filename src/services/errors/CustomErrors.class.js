export default class CustomError extends Error {
  constructor(type, message = "") {
    super(message || type.message);
    this.type = type;
    this.status = type.message;
  }
}
