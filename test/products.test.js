import { expect } from "chai";
import supertest from "supertest";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import ProductController from "../src/controllers/products.controller.js";

dotenv.config({ path: ".env.dev" });
const productController = new ProductController();
const request = supertest("http://localhost:5050");

const testProduct = {
  title: "Test",
  description: "Descripción del producto de prueba",
  category: "Categoría de prueba",
  price: 100,
  thumbnail: "https://via.placeholder.com/150",
  code: "PROD-001",
  stock: 10,
};
const invalidProduct = {
  title: "Test",
  description: "Descripción del producto de prueba",
  category: "Categoría de prueba",
  thumbnail: "https://via.placeholder.com/150",
  code: "PROD-001",
  stock: 10,
};
const sameCode = {
  title: "Test",
  price: 50,
  code: "E006",
}
const updatedProduct = {
  title: "Test updated",
  price: 50,
  owner: "admin"
}

let id;

describe("Test de rutas de Productos", () => {
  before(async function () {
    await mongoose.connect(process.env.MONGODB_URI);
  });
  beforeEach(async function () {});
  after(async function () {
    await mongoose.disconnect();
  });
  afterEach(async function () {});

  it("GET /api/products Debe devolver todos los productos", async function () {
    const res = await request.get("/api/products").set("Cookie", global.cookie);

    expect(res.statusCode).to.be.eql(200);
    expect(res.body.payload).to.be.an("array");
  });

  it("POST /api/products No debe agregar producto por falta de parametros", async function () {
    const res = await request
      .post("/api/products")
      .set("Cookie", global.cookie)
      .send(invalidProduct);

    expect(res.statusCode).to.be.eql(400);
    expect(res.body.error).to.be.eql("Faltan parámetros obligatorios");
  });

  it("POST /api/products Debe agregar un producto", async function () {
    const res = await request
      .post("/api/products")
      .set("Cookie", global.cookie)
      .send(testProduct);
    id = res.body.payload._id;

    expect(res.statusCode).to.be.eql(201);
    expect(res.body.message).to.be.eql("producto agregado");
    expect(res.body.payload).to.have.property("title", testProduct.title);
    expect(res.body.payload).to.have.property("code", testProduct.code);
    expect(res.body.payload).to.have.property("status");
    expect(res.body.payload).to.have.property("owner");
    expect(id).to.not.be.null;
    expect(id).to.match(/^[0-9a-fA-F]{24}$/);
  });

  it("PUT /api/products/:pid No debe actualizar el producto por tener el mismo codigo que otro", async function () {
    const res = await request
      .put(`/api/products/${id}`)
      .set("Cookie", global.cookie)
      .send(sameCode);
    
    expect(res.statusCode).to.be.eql(400);
    expect(res.body.error).to.be.eql("El código del producto ya existe");

    const product = await productController.getById(id);
    expect(product.code).to.not.be.eql(sameCode.code);
    expect(product.price).to.not.be.eql(sameCode.price);
  });

  it("PUT /api/products/:pid Debe actualizar el producto", async function(){
    const res = await request
      .put(`/api/products/${id}`)
      .set("Cookie", global.cookie)
      .send(updatedProduct);

    expect(res.statusCode).to.be.eql(200);
    expect(res.body.message).to.be.eql("producto actualizado");
    expect(res.body.payload).to.have.property("title", updatedProduct.title);
    expect(res.body.payload).to.have.property("price", updatedProduct.price);
    expect(res.body.payload).to.have.property("owner", 'pepeperez@gmail.com');
  })

  it("GET api/products/:pid Debe devolver un producto", async function () {
    const res = await request
      .get(`/api/products/${id}`)
      .set("Cookie", global.cookie);

    expect(res.statusCode).to.be.eql(200);
    expect(res.body.payload).to.have.property("title", updatedProduct.title);
    expect(res.body.payload).to.have.property("price", updatedProduct.price);
    expect(res.body.payload).to.have.property("owner", 'pepeperez@gmail.com');
    expect(res.body.payload).to.have.property("code", testProduct.code);
  });

  it("DELETE /api/products/:pid Debe eliminar el producto", async function () {
    const res = await request
      .delete(`/api/products/${id}`)
      .set("Cookie", global.cookie);

    expect(res.statusCode).to.be.eql(200)
    expect(res.body.message).to.be.eql("producto eliminado");

    try {
      await productController.getById(id);
    } catch (error) {
      expect(error.message).to.be.eql("Id no encontrado");
    }
  });
});
