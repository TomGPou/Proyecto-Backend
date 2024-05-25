import mongoose from "mongoose";
import productsModel from "./products.model.js";

mongoose.pluralize(null);

const collection = "carts";

const schema = new mongoose.Schema({
  products: {
    type: [{ _id: mongoose.Schema.Types.ObjectId, quantity: Number }],
    required: true,
  },
});

schema.pre("find", function () {
  this.populate({ path: "products._id", model: productsModel });
});

const model = mongoose.model(collection, schema);

export default model;
