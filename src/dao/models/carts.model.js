import mongoose from "mongoose";

mongoose.pluralize(null);

const collection = "carts";

const schema = new mongoose.Schema({
  products: { type: Object, required: true },
});

const model = mongoose.model(collection, schema);

export default model;
