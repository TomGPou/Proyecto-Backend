import productsModel from "../../../models/products.model.js";

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
      return err.message;
    }
  }

  // AGREGAR PRODUCTO
  async add(newProduct) {
    // Validar productos duplicados
    const isDuplicated = await productsModel.findOne({ code: newProduct.code });
    if (isDuplicated) throw new Error("El código del producto ya existe");

    // Cargar a DB
    return await productsModel.create(newProduct);
  }

  //  BUSCAR PRODUCTO POR ID
  async getById(pid) {
    const product = productsModel.findById(pid);

    return product || null;
  }

  // ACTUALIZAR PRODUCTO
  async update(pid, data) {
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

  // OBTENER STOCK
  async getStock(pid) {
    const product = await productsModel.findById(pid);
    return product.stock;
  }
}
