//* IMPORTS
import ProductService from "../services/dao/mdb/product.service.mdb.js";
// import ProductService from "../services/dao/fileSystem/product.service.fs.js";
//* INIT
const productService = new ProductService();

//* DTO
class ProductDTO {
  constructor(product) {
    this.product = product;
    this.product.code = product.code.toUpperCase();
  }
}

//* CONTROLLER
export default class ProductController {
  constructor() {}

  //* OBTENER PRODUCTOS
  get = async (limit, page, category, inStock, sort) => {
    try {
      return await productService.get(limit, page, category, inStock, sort);
    } catch (error) {
      return { error: error.message };
    }
  };

  //* AGREGAR PRODUCTO
  add = async (newProduct) => {
    try {
      // Validar la carga de datos
      if (
        !newProduct.title ||
        !newProduct.description ||
        !newProduct.category ||
        !newProduct.code ||
        !newProduct.price ||
        !newProduct.stock
      ) {
        throw new Error("Falta completar datos del producto");
      }

      const normalizeProduct = new ProductDTO(newProduct);

      return await productService.add(normalizeProduct);
    } catch (error) {
      return { error: error.message };
    }
  };

  //*  BUSCAR PRODUCTO POR ID
  getById = async (pid) => {
    try {
      return await productService.getById(pid);
    } catch (error) {
      return { error: error.message };
    }
  };

  //* ACTUALIZAR PRODUCTO
  update = async (pid, data) => {
    try {
      if (data.code) {
        normalizedData = new ProductDTO(data);
        return await productService.update(pid, normalizedData);
      }
      return await productService.update(pid, data);
    } catch (error) {
      return { error: error.message };
    }
  };

  //* BORRAR PRODUCTO
  deleteProduct = async (pid) => {
    try {
      return await productService.deleteProduct(pid);
    } catch (error) {
      return { error: error.message };
    }
  };
}
