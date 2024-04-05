class ProductManager {
  constructor() {
    this.products = [];
  }

  addProduct(title, description, price, thumbnail, code, stock) {
    // Validar la carga de datos
    if (!title || !description || !price || !thumbnail || !code || !stock)
      throw new Error("Falta completar datos del producto");

    // Validar productos duplicados
    const isDuplicated = this.products.some((product) => product.code === code);

    if (isDuplicated)
      throw new Error("El código debe ser único para cada producto");

    // Agregando producto
    const newProduct = {
      id: this.products.length + 1,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };
    this.products.push(newProduct);

    return newProduct;
  }

  // Obtener lista de productos
  getProducts() {
    return this.products;
  }

  //  Buscar un producto por su id
  getProductById(id) {
    const product = this.products.find((p) => p.id == id);
    if (!product) {
      throw new Error("NOT FOUND");
    }
    return product;
  }
}

// TESTING
const productManager = new ProductManager();

//  Agregar productos
productManager.addProduct(
  "Producto Prueba",
  "prueba",
  200,
  "sin imagen",
  "abc123",
  25
);

productManager.addProduct(
  "Producto Prueba2",
  "prueba2",
  200,
  "sin imagen",
  "abc124",
  25
);

// ver productos
const productsList = productManager.getProducts();
console.log(productsList);

//  buscar producto por ID
// const productId = productManager.getProductById(1);
