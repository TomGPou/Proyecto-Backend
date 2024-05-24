import mongoose from "mongoose";
import productsModel from "./products.model.js";

mongoose.pluralize(null);

const collection = "carts";

const schema = new mongoose.Schema({
  products: {
    type: { product: mongoose.Schema.Types.ObjectId, quantity: Number },
    required: true,
  },
});

schema.pre("find", function () {
  this.populate({ path: "products.product", model: productsModel });
});

const model = mongoose.model(collection, schema);

export default model;
