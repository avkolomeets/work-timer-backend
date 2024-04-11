import { Request } from "./interfaces";

export function requestToParams<T = any>(req: Request<T>): T {
  return {
    ...req.query,
    ...req.body,
  };
}
