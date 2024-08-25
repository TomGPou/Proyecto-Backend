import { expect } from "chai";
import supertest from "supertest";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import UserController from "../src/controllers/users.controller.js";
import usersModel from "../src/services/dao/mdb/models/users.model.js";


dotenv.config({ path: ".env.dev" });
const userController = new UserController();
const request = supertest("http://localhost:5050");

const testUser = {
  first_name: "Pepe",
  last_name: "Perez",
  email: "pepeperez@gmail.com",
  password: "abc123",
  role: "premium"
};
const invalidUser = {
  first_name: "Pepe",
  last_name: "Perez",
  email: "pepeperez@gmail.com",
  password: "abc124",
};
let userId;
let cookie;

describe("Test de sesiones de API", () => {
  before(async function () {
    await mongoose.connect(process.env.MONGODB_URI);
  });
  beforeEach(async function () {});
  after(async function () {
    await userController.delete(userId);
    await mongoose.disconnect();
  });
  afterEach(async function () {});

  it("POST /api/auth/register Debe registrar correctamente un usuario", async function () {
    const res = await request.post("/api/auth/register").send(testUser);

    expect(res.statusCode).to.be.eql(302);
    expect(res.headers.location).to.be.eql("/login");

    const user = await userController.getOne({ email: testUser.email });
    userId = user._id;
    expect(user).to.not.be.null
    expect(user.email).to.be.eql(testUser.email);
    expect(user.first_name).to.be.eql(testUser.first_name);
    expect(user.last_name).to.be.eql(testUser.last_name);
  });

  it("POST /api/auth/register No debe registrar el mismo usuario", async function () {
    const res = await request.post("/api/auth/register").send(testUser);

    expect(res.statusCode).to.be.eql(302);
    expect(res.headers.location).to.be.eql(
      "/login?error=Email%20ya%20registrado"
    );

    const users = await usersModel.find({ email: testUser.email });
    expect(users.length).to.be.eql(1);
  });

  it("POST /api/auth/login Debe recibir mensaje de error por datos incorrectos", async function () {
    const res = await request.post("/api/auth/login").send(invalidUser);
    expect(res.statusCode).to.be.eql(400);
    expect(res.body.error).to.be.eql("Parámetro no válido");
    expect(res.headers["set.cookie"]).to.be.undefined
  });

  it("POST /api/auth/login Debe loguear correctamente un usuario", async function () {
    const res = await request.post("/api/auth/login").send(testUser);

    expect(res.statusCode).to.be.eql(302);
    expect(res.headers.location).to.be.eql("/");

    cookie = res.headers["set-cookie"][0];
    expect(cookie).to.include('connect.sid=');
    expect(cookie).to.include('HttpOnly');

    // Guardar cookie en variable global
    global.cookie = cookie;
  });

  it("GET /api/auth/current Debe devolver el usuario logueado", async function () {
    const res = await request.get("/api/auth/current").set("Cookie", cookie);

    expect(res.statusCode).to.be.eql(200);
    expect(res.body.payload).to.have.property("email", testUser.email);
    expect(res.body.payload).to.have.property("first_name", testUser.first_name);
    expect(res.body.payload).to.have.property("last_name", testUser.last_name);
  });
});
