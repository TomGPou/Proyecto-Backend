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
  documents: {type: [{name: String, reference: String}], required: false},
  last_connection: { type: Date, required: false },
});

const model = mongoose.model(collection, schema);

export default model;