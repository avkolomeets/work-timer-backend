import { removeUndefinedProperties } from "../utils/json-util";
import { toNumberOrUndefined } from "../utils/number-util";

export const taskToJson = (task) => {
  return {
    id: task.ref.id,
    ...task.data,
  };
};

export const taskDataFromReq = (req) => {
  const _toParams = (params) => {
    const { year, month, link, label, time, type, created, modified, user } =
      params;
    return removeUndefinedProperties({
      user,
      year: toNumberOrUndefined(year),
      month: toNumberOrUndefined(month),
      link,
      label,
      time: toNumberOrUndefined(time),
      type,
      created: toNumberOrUndefined(created),
      modified: toNumberOrUndefined(modified),
    });
  };
  return { ..._toParams(req.query), ..._toParams(req.body) };
};
