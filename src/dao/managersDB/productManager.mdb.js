import productsModel from "../models/products.model.js";

export default class ProductManager {
  // constructor() {
  //   this.products = [];
  // }

  // OBTENER TODOS LOS PRODUCTOS
  async getProducts(limit, page, category, sort) {
    try {
      // paginado y ordenamiento
      const options = {
        limit: limit || 10,
        page: page || 1,
        sort: { price: sort },
lean: true,
      };
      // filtrar por categoría
      if (category) {
        const products = await productsModel.paginate(
          { category: category },
          options
        );
        return products;
      } else {
        const products = await productsModel.paginate({}, options);
        return products;
      }
    } catch (err) {
      return err.message;
    }
  }

  // AGREGAR PRODUCTO
  async addProduct(newProduct) {
    // Validar la carga de datos
    if (
      !newProduct.title ||
      !newProduct.description ||
      !newProduct.category ||
      !newProduct.code ||
      !newProduct.price ||
      !newProduct.stock
    )
      throw new Error("Falta completar datos del producto");

    // Validar productos duplicados
    const isDuplicated = await productsModel.findOne({ code: newProduct.code });
    if (isDuplicated) throw new Error("El código del producto ya existe");

    // Cargar a DB
    return await productsModel.create(newProduct);
  }

  //  BUSCAR PRODUCTO POR ID
  async getProductById(pid) {
    const product = productsModel.findById(pid);

    return product || null;
  }

  // ACTUALIZAR PRODUCTO
  async updateProduct(pid, data) {
    // validar si existe el ID
    const exist = await productsModel.findById(pid);
    if (!exist) throw new Error("El producto no existe");
    // validar si el código ya existe
    const isDuplicated = await productsModel.findOne({
      code: data.code,
      _id: { $ne: pid },
    });
    if (isDuplicated) throw new Error("El código del producto ya existe");

    // Actualizar
    return await productsModel.findByIdAndUpdate(pid, data, { new: true });
  }

  // BORRAR PRODUCTO
  async deleteProduct(pid) {
    // validar si existe el ID
    const exist = await productsModel.findById(pid);
    if (!exist) throw new Error("El producto no existe");
    // buscar y borrar
    return await productsModel.findByIdAndDelete(pid);
  }
}
