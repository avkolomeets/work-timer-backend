import { CollectionItem } from "models/intefaces-collections";
import { USERS_COLLECTION, UserCollectionItemData } from "../../models/user";
import {
  CustomError,
  ERROR_CODE_TOKEN_INVALID,
  ERROR_CODE_TOKEN_REQUIRED,
} from "../error-util";
import { client } from "../query/client";
import { Request } from "../query/interfaces";
import { requestToParams } from "../query/request-util";
import { userDataFromKey } from "./key-util";

/**
 * Fully validates the passed token and returns a user if everything is OK.
 * Otherwise rejects with an error.
 */
export async function queryUserByToken(
  req: Request<{ token?: string }>
): Promise<UserCollectionItemData & { id: string }> {
  const { token } = requestToParams(req);
  if (!token) {
    return Promise.reject(
      new CustomError("Token is required.", ERROR_CODE_TOKEN_REQUIRED)
    );
  }
  const userData = userDataFromKey(token);
  return queryUserByCredentials(userData?.username, userData?.password).catch(
    () =>
      Promise.reject(
        new CustomError("Token is invalid.", ERROR_CODE_TOKEN_INVALID)
      )
  );
}

/**
 * Fully validates the passed credentials and returns a user if everything is OK.
 * Otherwise rejects with an error.
 */
export async function queryUserByCredentials(
  username: string | undefined,
  password: string | undefined
): Promise<UserCollectionItemData & { id: string }> {
  if (!username) {
    return Promise.reject(new Error("`username` is required."));
  }
  if (!password) {
    return Promise.reject(new Error("`password` is required."));
  }
  const user = await queryUserByName(username);
  if (!user) {
    return Promise.reject(new Error("Invalid credentials."));
  }
  if (userDataFromKey(user.data.key)?.password !== password) {
    return Promise.reject(new Error("Invalid credentials."));
  }
  return { id: user.ref.id, ...user.data };
}

/**
 * Returns the user or null if not found.
 */
export async function queryUserByName(
  username: string | undefined
): Promise<CollectionItem<UserCollectionItemData> | null> {
  const user = await (username
    ? client
        .getAllByIndexName<UserCollectionItemData>(
          USERS_COLLECTION.users_by_name,
          username
        )
        .then((users) => users[0])
    : null);
  return user;
}
