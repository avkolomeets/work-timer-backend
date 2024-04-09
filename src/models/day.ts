import { removeUndefinedProperties } from "../utils/json-util";
import { toNumberOrUndefined } from "../utils/number-util";

export const dayToJson = (day) => {
  return {
    ...day.data,
  };
};

export const dayDataFromReq = (req) => {
  const _toParams = (params) => {
    const { user, year, month, day, time, workIntervals } = params;
    return removeUndefinedProperties({
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
  return { ..._toParams(req.query), ..._toParams(req.body) };
};
