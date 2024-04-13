import { CollectionItem } from "./intefaces-collections";

export const USERS_COLLECTION = {
  name: "users",
  users_by_name: "users_by_name",
};

export const userToJson = (
  user: Pick<CollectionItem<UserCollectionItemData>, "data">
): Omit<UserCollectionItemData, "key"> => {
  return {
    name: user.data.name,
    fullName: user.data.fullName,
    logo: user.data.logo,
  };
};

export type UserCollectionItemData = {
  name: string;
  key: string;
  fullName: string;
  logo: string;
};

export type UserRequestParams = Partial<{
  token: string;
  username: string;
  password: string;
  fullName: string;
  logo: string;
}>;
