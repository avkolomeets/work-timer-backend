import path from "path";
export const createPath = (page: string) =>
  path.resolve(__dirname, "../views", `${page}.ejs`);
