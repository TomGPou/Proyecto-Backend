import productsModel from "./models/products.model.js";
import CustomError from "../../errors/CustomErrors.class.js";
import errorsDictionary from "../../errors/errrosDictionary.js";

export default class ProductService {
  constructor() {}
  // OBTENER TODOS LOS PRODUCTOS
  async get(limit, page, category, inStock, sort) {
    try {
      // opciones de paginado y ordenamiento
      const options = {
        limit: limit || 10,
        page: page || 1,
        sort: { price: sort },
        lean: true,
      };
      // opciones de filtrarado
      const filter = {};
      if (category) filter.category = category;
      if (inStock) filter.stock = { $gt: 0 };

      const products = await productsModel.paginate(filter, options);
      // link a pagina previa y siguiente
      if (products.prevPage) {
        products.prevLink = `?limit=${limit}&page=${products.prevPage}`;
        if (category) products.prevLink += `&category=${category}`;
        if (inStock) products.prevLink += `&inStock=true`;
      } else {
        products.prevLink = null;
      }
      if (products.nextPage) {
        products.nextLink = `?limit=${limit}&page=${products.nextPage}`;
        if (category) products.nextLink += `&category=${category}`;
        if (inStock) products.nextLink += `&inStock=true`;
      } else {
        products.nextLink = null;
      }
      return products;
    } catch (err) {
      if (!(err instanceof CustomError)) {
        console.log(err.message);
        return new CustomError(errorsDictionary.UNHANDLED_ERROR);
      }
      throw err;
    }
  }

  // AGREGAR PRODUCTO
  async add(newProduct) {
    try {
      // Validar productos duplicados
      const isDuplicated = await productsModel.findOne({
        code: newProduct.code,
      });
      if (isDuplicated)
        return new CustomError(errorsDictionary.PRODUCT_CODE_EXISTS);

      // Cargar a DB
      return await productsModel.create(newProduct);
    } catch (err) {
      if (!(err instanceof CustomError)) {
        console.log(err.name);
        if (err.name === "ValidationError") {
          console.log(err.message);
          return new CustomError(errorsDictionary.INVALID_TYPE);
        } else {
          console.log(err.message);
          return new CustomError(errorsDictionary.UNHANDLED_ERROR);
        }
      }
      throw err;
    }
  }

  //  BUSCAR PRODUCTO POR ID
  async getById(pid) {
    try {
      const product = await productsModel.findOne({ _id: pid }).lean();
      if (!product) {
        return new CustomError(errorsDictionary.ID_NOT_FOUND);
      }
      return product;
    } catch (err) {
      if (!(err instanceof CustomError)) {
        console.log(err.message);
        return new CustomError(errorsDictionary.UNHANDLED_ERROR);
      }
      throw err;
    }
  }

  // ACTUALIZAR PRODUCTO
  async update(pid, data) {
    try {
      // validar si existe el ID
      const exist = await productsModel.findById(pid);
      if (!exist) return new CustomError(errorsDictionary.ID_NOT_FOUND);
      // validar si el código ya existe
      if (data.code) {
        const isDuplicated = await productsModel.findOne({
          code: data.code,
          _id: { $ne: pid },
        });
        if (isDuplicated)
          return new CustomError(errorsDictionary.PRODUCT_CODE_EXISTS);
      }

      // Actualizar
      return await productsModel.findByIdAndUpdate(pid, data, { new: true });
    } catch (err) {
      if (!(err instanceof CustomError)) {
        console.log(err.name);
        if (err.name === "ValidationError") {
          console.log(err.message);
          return new CustomError(errorsDictionary.INVALID_TYPE);
        } else {
          console.log(err.message);
          return new CustomError(errorsDictionary.UNHANDLED_ERROR);
        }
      }
      throw err;
    }
  }

  // BORRAR PRODUCTO
  async deleteProduct(pid) {
    try {
      // validar si existe el ID
      const exist = await productsModel.findById(pid);
      if (!exist) return new CustomError(errorsDictionary.ID_NOT_FOUND);
      // buscar y borrar
      return await productsModel.findByIdAndDelete(pid);
    } catch (err) {
      if (!(err instanceof CustomError)) {
        console.log(err.message);
        return new CustomError(errorsDictionary.UNHANDLED_ERROR);
      }
      throw err;
    }
  }

  // OBTENER STOCK
  async getStock(pid) {
    try {
      const product = await this.getById(pid);

      return product.stock;
    } catch (err) {
      if (!(err instanceof CustomError)) {
        console.log(err.message);
        return new CustomError(errorsDictionary.UNHANDLED_ERROR);
      }
      throw err;
    }
  }
}
