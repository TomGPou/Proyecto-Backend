import { expect } from "chai";
import supertest from "supertest";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import CartController from "../src/controllers/cart.controller.js";
import ProductController from "../src/controllers/products.controller.js";

dotenv.config({ path: ".env.dev" });
const cartController = new CartController();
const productController = new ProductController();
const request = supertest("http://localhost:5050");

let cart;
let cartId;
const fakeId = "66b0d571cf67e043da97d597";
const testProduct = {
  title: "Test",
  description: "Descripción del producto de prueba",
  category: "Categoría de prueba",
  price: 100,
  thumbnail: "https://via.placeholder.com/150",
  code: "PROD-001",
  stock: 10,
};
let prodId;
const testProduct2 = {
  title: "Test2",
  description: "Descripción del producto de prueba",
  category: "Categoría de prueba",
  price: 100,
  thumbnail: "https://via.placeholder.com/150",
  code: "PROD-002",
  stock: 10,
};
let prodId2;

describe("Test de rutas de Carritos", () => {
  before(async function () {
    await mongoose.connect(process.env.MONGODB_URI);
    const product = await productController.add(testProduct);
    const product2 = await productController.add(testProduct2);
    prodId = product._id;
    prodId2 = product2._id;
  });
  beforeEach(async function () {});
  after(async function () {
    await productController.deleteProduct(prodId, "admin");
    await productController.deleteProduct(prodId2, "admin");
    await cartController.delete(cartId);
    await mongoose.disconnect();
  });
  afterEach(async function () {});

  it("POST /api/carts Debe crear un carrito", async function () {
    const res = await request.post("/api/carts");
    expect(res.statusCode).to.be.eql(200);

    cart = res.body.payload;
    expect(cart).to.have.property("_id");
    expect(cart._id).to.match(/^[0-9a-fA-F]{24}$/);
    cartId = cart._id;
    expect(cart).to.have.property("products");
    expect(cart.products).to.be.eql([]);
  });

  it("PUT /api/carts/:cid/product/:pid Debe agregar un producto al carrito", async function () {
    const res = await request
      .put(`/api/carts/${cartId}/product/${prodId}`)
      .set("Cookie", global.cookie);

    expect(res.statusCode).to.be.eql(200);
    cart = res.body.payload;
    expect(cart.products[0]._id).to.be.eql(prodId.toString());
    expect(cart.products[0].quantity).to.be.eql(1);
  });

  it("PUT /api/carts/:cid/product/:pid Debe sumar una unidad al producto existente", async function () {
    const res = await request
      .put(`/api/carts/${cartId}/product/${prodId}`)
      .set("Cookie", global.cookie);

    expect(res.statusCode).to.be.eql(200);
    cart = res.body.payload;
    expect(cart.products[0]._id).to.be.eql(prodId.toString());
    expect(cart.products[0].quantity).to.be.eql(2);
  });

  it("PUT /api/carts/:cid/product/:pid Debe agregar otro producto al carrito con qty", async function () {
    const res = await request
      .put(`/api/carts/${cartId}/product/${prodId2}`)
      .set("Cookie", global.cookie)
      .send({ qty: 2 });

    expect(res.statusCode).to.be.eql(200);
    cart = res.body.payload;
    expect(cart.products[1]._id).to.be.eql(prodId2.toString());
    expect(cart.products[1].quantity).to.be.eql(2)
  })
  
  it("GET /api/carts/:cid Debe devolver un carrito", async function () {
    const res = await request
      .get(`/api/carts/${cartId}`)
      .set("Cookie", global.cookie);

    expect(res.statusCode).to.be.eql(200);
    expect(res.body.payload.products[0]._id._id).to.be.eql(prodId.toString());
    expect(res.body.payload.products[0].quantity).to.be.eql(2);
    expect(res.body.payload.products[1]._id._id).to.be.eql(prodId2.toString());
    expect(res.body.payload.products[1].quantity).to.be.eql(2);
  });

  it("DELETE /api/carts/:cid Debe vaciar un carrito", async function () {
    const res = await request
      .delete(`/api/carts/${cartId}`)
      .set("Cookie", global.cookie);

    expect(res.statusCode).to.be.eql(200);
    expect(res.body.payload.products).to.be.eql([]);
  });
});
