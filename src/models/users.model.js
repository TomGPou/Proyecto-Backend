import mongoose from "mongoose";

mongoose.pluralize(null);

const collection = "users";

const schema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true },
  age: { type: Number, required: false },
  password: { type: String, required: true },
  cart: { type: mongoose.Schema.Types.ObjectId, required: false },
  role: { type: String, enum: ['admin', 'user', 'premium'], default: 'user' },
});

const model = mongoose.model(collection, schema);

export default model;