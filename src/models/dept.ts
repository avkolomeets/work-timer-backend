import { Request } from "utils/query/interfaces";
import { requestToParams } from "utils/query/request-util";
import { removeMissingProperties } from "../utils/json-util";
import { toNumberOrUndefined } from "../utils/number-util";
import { CollectionItem } from "./intefaces-collections";

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
  const { dept } = requestToParams(req);
  return removeMissingProperties({
    dept: toNumberOrUndefined(dept),
  });
};
