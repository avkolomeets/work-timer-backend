import { Request } from "utils/query/interfaces";
import { removeMissingProperties } from "../utils/json-util";
import { toNumberOrUndefined } from "../utils/number-util";
import { CollectionItem } from "./intefaces-collections";
import { requestToParams } from "utils/query/request-util";
import { userDataFromKey } from "utils/auth/key-util";

export type DeptCollectionItemData = {
  user: string;
  dept: number;
};

export const deptToJson = (
  dept: CollectionItem<DeptCollectionItemData>
): DeptCollectionItemData => {
  return {
    ...dept.data,
  };
};

export type DeptRequestParams = Partial<{
  token: string;
  dept: number;
}>;

export const deptDataFromReq = (req: Request<DeptRequestParams>) => {
  const { token, dept } = requestToParams(req);
  const user = token && userDataFromKey(token)?.username;
  return removeMissingProperties({
    user,
    dept: toNumberOrUndefined(dept),
  });
};
