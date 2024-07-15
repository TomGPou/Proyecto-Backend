import * as url from "url";
import { Command } from "commander";

// CL Options
const program = new Command();
program.option("--mode <mode>").option("--port <port>");
program.parse();

const clOptions = program.opts();

// Config
const config = {
  PORT: process.env.PORT || clOptions.port || 5050,
  DIRNAME: url.fileURLToPath(new URL(".", import.meta.url)),
  get UPLOAD_DIR() {
    return `${this.DIRNAME}/public/img`;
  },
  MONGODB_URI: process.env.MONGODB_URI,
  MONGODB_ID_REGEX: /^[a-fA-F0-9]{24}$/,
  SECRET: process.env.SECRET,

  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
  GITHUB_CALLBACK_URL: process.env.GITHUB_CALLBACK_URL,

  GMAIL_APP_USER: process.env.GMAIL_APP_USER,
  GMAIL_APP_PASS: process.env.GMAIL_APP_PASS,
};

export default config;
