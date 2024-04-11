import { Request } from "utils/query/interfaces";
import { removeMissingProperties } from "../utils/json-util";
import { toNumberOrUndefined } from "../utils/number-util";
import { CollectionItem } from "./intefaces-collections";
import { requestToParams } from "utils/query/request-util";
import { userDataFromKey } from "utils/auth/key-util";

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
  const user = token && userDataFromKey(token)?.username;
  return removeMissingProperties({
    user,
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
