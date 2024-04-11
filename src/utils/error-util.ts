import { Response } from "express";

export const errorHandler = (res: Response) => (error: { message: string }) =>
  res.status(500).send(error.message);
