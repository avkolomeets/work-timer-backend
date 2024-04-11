import { Response } from "express";

export const resultHandler = (res: Response, value: any) => {
  res.status(200).json(value);
};
