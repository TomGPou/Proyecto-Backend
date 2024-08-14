import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Documentación de API",
      version: "1.0.0",
      description: "API de productos y carrito de compras",
    },
  },
  apis: ["./src/docs/**/*.yaml"],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
