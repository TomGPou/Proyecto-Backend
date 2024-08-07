import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"

mongoose.pluralize(null);

const collection = "products";

const schema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  code: { type: String, required: true },
  price: { type: Number, required: true },
  thumbnail: { type: String, required: true },
  stock: { type: Number, required: true },
  status: { type: Boolean, required: true, default: true },
  owner: { type: String, required: true, default: "admin" },
});

schema.plugin(mongoosePaginate);

const model = mongoose.model(collection, schema);

export default model;
