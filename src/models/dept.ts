import { removeUndefinedProperties } from "utils/json-util";
import { toNumberOrUndefined } from "utils/number-util";

export const deptToJson = (dept) => {
  return {
    ...dept.data,
  };
};

export const deptDataFromReq = (req) => {
  const _toParams = (params) => {
    const { user, dept } = params;
    return removeUndefinedProperties({
      user,
      dept: toNumberOrUndefined(dept),
    });
  };
  return { ..._toParams(req.query), ..._toParams(req.body) };
};
