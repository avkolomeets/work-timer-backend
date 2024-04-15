import { Response } from "express";

/** https://en.wikipedia.org/wiki/List_of_HTTP_status_codes */
export const RESULT_CODES = {
  ok: 200,
};

export const resultHandler = (res: Response, value: any) => {
  res.status(RESULT_CODES.ok).json(value);
};
