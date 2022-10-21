import * as chalk from "chalk";
/* c8 ignore next 4 */
const isSupported =
  process.platform !== "win32" ||
  process.env.CI ||
  process.env.TERM === "xterm-256color";

const folder = "└─";
const space = " ";

const main = {
  info: chalk.blue("ℹ"),
  success: chalk.green("✔"),
  warning: chalk.yellow("⚠"),
  error: chalk.red("✖"),
  bullet: "●",
  folder,
  space,
};

const fallbacks = {
  info: chalk.blue("i"),
  success: chalk.green("√"),
  warning: chalk.yellow("‼"),
  error: chalk.red("×"),
  bullet: "*",
  folder,
  space,
};

function get(name: keyof typeof main) {
  /* c8 ignore next */
  const symbols = isSupported ? main : fallbacks;
  return symbols[name];
}

export default {
  ...(isSupported ? main : /* c8 ignore next */ fallbacks),
  get,
};
