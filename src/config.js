import * as url from "url";

const config = {
  PORT: 5050,
  DIRNAME: url.fileURLToPath(new URL(".", import.meta.url)),
  get UPLOAD_DIR() {
    return `${this.DIRNAME}/public/img`;
  },
  MONGODB_URI: "mongodb+srv://admin:coder2024@clusterproyecto.09d4t4t.mongodb.net/ecommerce"
};

export default config;
