import faker from "@faker-js/faker";

// PRODUCTS SCHEMA
// title: { type: String, required: true },
// description: { type: String, required: true },
// category: { type: String, required: true },
// code: { type: String, required: true },
// price: { type: Number, required: true },
// thumbnail: { type: String, required: true },
// stock: { type: Number, required: true },
// status: { type: Boolean, required: true, default: true }

const CATEGORIES = ["Estrategia", "Rol"];

export const generateFakeProducts = async (qty) => {
  const products = [];
  for (let i = 0; i < qty; i++) {
    const title = faker.commerce.product();
    const description = faker.commerce.productDescription();
    const category = faker.helpers.arrayElement(CATEGORIES);
    const code = faker.string.alphanumeric({
      casing: "upper",
      length: { min: 5, max: 5 },
    });
    const price = faker.commerce.price({ min: 30, max: 200, dec: 0 });
    const stock = faker.number.int({ min: 0, max: 100 });
    const thumbnail = `static/img/${title}.jpg`;
    const status = true;

    products.push({
      title,
      description,
      category,
      code,
      price,
      stock,
      thumbnail,
      status
    });
  }
  return products;
};
