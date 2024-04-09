import { removeUndefinedProperties } from "utils/json-util";

export const userToJson = (user) => {
  return {
    ...user.data,
  };
};

export const userDataFromReq = (req) => {
  const _toParams = (params) => {
    const { user } = params;
    return removeUndefinedProperties({
      user,
    });
  };
  return { ..._toParams(req.query), ..._toParams(req.body) };
};
