import path from "path";
export const createPath = (page) =>
  path.resolve(__dirname, "../views", `${page}.ejs`);
