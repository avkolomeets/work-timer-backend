import { UserCollectionItemData } from "../../models/user";
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
): Promise<UserCollectionItemData> {
  const { token } = requestToParams(req);
  if (!token) {
    return Promise.reject(new Error("Token is not specified."));
  }
  const userData = userDataFromKey(token);
  if (!userData?.username) {
    return Promise.reject(new Error("User doesn't exist."));
  }
  const user = await client
    .getAllByIndexName<UserCollectionItemData>(
      "users_by_name",
      userData.username
    )
    .then((users) => users[0]?.data);
  if (!user) {
    return Promise.reject(new Error("User doesn't exist."));
  }
  if (userDataFromKey(user.key)?.password !== userData.password) {
    return Promise.reject(new Error("Token is invalid."));
  }
  return user;
}
