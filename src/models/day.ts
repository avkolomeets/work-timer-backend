import { removeMissingProperties } from "../utils/json-util";
import { toNumberOrUndefined } from "../utils/number-util";
import { Request } from "../utils/query/interfaces";
import { requestToParams } from "../utils/query/request-util";
import { CollectionItem } from "./intefaces-collections";

export const DAYS_COLLECTION = {
  name: "days",
  days_by_user_year_month_day: "days_by_user_year_month_day",
  days_by_user_year_month: "days_by_user_year_month",
};

export type DayCollectionItemData = {
  user: string;
  year: number;
  month: number;
  day: number;
  time: number;
  workIntervals: number[][];
};

export const dayToJson = (
  day: CollectionItem<DayCollectionItemData>
): DayCollectionItemData => {
  return {
    ...day.data,
  };
};

export type DayRequestParams = Partial<{
  token: string;
  year: number;
  month: number;
  day: number;
  time: number;
  workIntervals: number[][];
}>;

export const dayDataFromReq = (req: Request<DayRequestParams>) => {
  const { token, year, month, day, time, workIntervals } = requestToParams(req);
  return removeMissingProperties({
    year: toNumberOrUndefined(year),
    month: toNumberOrUndefined(month),
    day: toNumberOrUndefined(day),
    time: toNumberOrUndefined(time),
    workIntervals:
      workIntervals == null
        ? workIntervals
        : typeof workIntervals === "string"
        ? JSON.parse(workIntervals)
        : workIntervals,
  });
};
