import * as url from "url";

const config = {
  PORT: 5050,
  DIRNAME: url.fileURLToPath(new URL(".", import.meta.url)),
  get UPLOAD_DIR() {
    return `${this.DIRNAME}/public/img`;
  },
  MONGODB_URI:
    "mongodb+srv://admin:coder2024@clusterproyecto.09d4t4t.mongodb.net/ecommerce",
  MONGODB_ID_REGEX: /^[a-fA-F0-9]{24}$/,
  SECRET: "coder_53160_abc",

  GITHUB_CLIENT_ID: "Iv23liB8jgKFdThwsuEg",
  GITHUB_CLIENT_SECRET: "2042d962897109a0cd6edc2d4160d86233558609",
  GITHUB_CALLBACK_URL: "http://localhost:5050/api/auth/ghlogincallback",
};

export default config;
