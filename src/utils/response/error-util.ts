import { Response } from "express";

/** https://en.wikipedia.org/wiki/List_of_HTTP_status_codes */
export const ERROR_CODES = {
  badRequest: 400,
  notFound: 404,
  tokenInvalid: 498,
  tokenRequired: 499,
};

export class CustomError {
  message: string;
  code: number | undefined;
  constructor(message: string, code?: number) {
    this.message = message;
    this.code = code;
  }
}

export const errorHandler =
  (res: Response) => (error: Error | { message: string; code?: number }) =>
    res
      .status(
        (error instanceof CustomError && error.code) || ERROR_CODES.badRequest
      )
      .send({ error: { message: error.message } });
