//* IMPORTS
import ProductManager from "./controllersDB/productManager.mdb.js";
//* INIT
const productManager = new ProductManager();

//* OBTENER PRODUCTOS
export const getProducts = async (limit, page, category, inStock, sort) => {
  try {
    return await productManager.getProducts(
      limit,
      page,
      category,
      inStock,
      sort
    );
  } catch (error) {
    return { error: error.message };
  }
};

//* AGREGAR PRODUCTO
export const addProduct = async (newProduct) => {
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
    return await productManager.addProduct(newProduct);
  } catch (error) {
    return { error: error.message };
  }
};

//*  BUSCAR PRODUCTO POR ID
export const getProductById = async (pid) => {
  try {
    return await productManager.getProductById(pid);
  } catch (error) {
    return { error: error.message };
  }
};

//* ACTUALIZAR PRODUCTO
export const updateProduct = async (pid, data) => {
  try {
    return await productManager.updateProduct(pid, data);
  } catch (error) {
    return { error: error.message };
  }
};

//* BORRAR PRODUCTO
export const deleteProduct = async (pid) => {
  try {
    return await productManager.deleteProduct(pid);
  } catch (error) {
    return { error: error.message };
  }
};
