import { Response } from "express";

export const errorHandler = (res: Response) => (error: { message: string }) =>
  res.status(400).send(error.message);
