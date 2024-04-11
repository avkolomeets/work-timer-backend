import { Request } from "../utils/query/interfaces";
import { removeMissingProperties } from "../utils/json-util";
import { CollectionItem } from "./intefaces-collections";
import { requestToParams } from "utils/query/request-util";

export type UserCollectionItemData = {
  name: string;
  key: string;
  fullName: string;
  logo: string;
};

export const userToJson = (
  user: CollectionItem<UserCollectionItemData>
): UserCollectionItemData => {
  return {
    ...user.data,
  };
};

export type UserRequestParams = Partial<{
  username: string;
  password: string;
  fullName: string;
  logo: string;
}>;

export const userDataFromReq = (
  req: Request<UserRequestParams>
): Partial<{
  username: string;
  password: string;
  fullName: string;
  logo: string;
}> => {
  const { username, password, fullName, logo } = requestToParams(req);
  return removeMissingProperties({
    username,
    password,
    fullName,
    logo,
  });
};
