import { Response } from "express";

/**
 * https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
 */
export const ERROR_CODE_TOKEN_INVALID = 498;

/**
 * https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
 */
export const ERROR_CODE_TOKEN_REQUIRED = 499;

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
      .status((error instanceof CustomError && error.code) || 400)
      .send({ error: { message: error.message } });
