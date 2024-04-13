import { Response } from "express";
import {
  USERS_COLLECTION,
  UserCollectionItemData,
  UserRequestParams,
  userToJson,
} from "../models/user";
import { userDataToKey } from "../utils/auth/key-util";
import {
  queryUserByCredentials,
  queryUserByName,
  queryUserByToken,
} from "../utils/auth/user-util";
import { errorHandler } from "../utils/error-util";
import { client } from "../utils/query/client";
import { Request } from "../utils/query/interfaces";
import { requestToParams } from "../utils/query/request-util";
import { resultHandler } from "../utils/response-util";

// CREATE

export const addUser = (req: Request<UserRequestParams>, res: Response) => {
  console.log("addUser");
  console.log(req.body);
  console.log(req.query);
  console.log(req.params);
  const { username, fullName, password, logo } = requestToParams(req);
  if (!username) {
    errorHandler(res)(new Error("`username` name is required."));
    return;
  }
  if (!fullName) {
    errorHandler(res)(new Error("`fullName` is required."));
    return;
  }
  if (!password) {
    errorHandler(res)(new Error("`password` is required."));
    return;
  }
  queryUserByName(username)
    .then((user) => {
      if (user) {
        return Promise.reject(
          new Error(`User #${user.data.name} already exists`)
        );
      }
      const data = {
        name: username,
        fullName,
        key: userDataToKey(username, password),
        logo,
      };
      client
        .createCollectionItem<UserCollectionItemData>("users", data)
        .then((user) => resultHandler(res, userToJson(user)));
    })
    .catch(errorHandler(res));
};

// READ

export const getUser = (req: Request<{ token?: string }>, res: Response) => {
  queryUserByToken(req)
    .then((user) => {
      resultHandler(res, userToJson({ data: user }));
    })
    .catch(errorHandler(res));
};

export const checkUserName = (
  req: Request<UserRequestParams>,
  res: Response
) => {
  const { username } = requestToParams(req);
  queryUserByName(username)
    .then((user) => {
      resultHandler(res, { exists: !!user });
    })
    .catch(errorHandler(res));
};

export const getToken = (req: Request<UserRequestParams>, res: Response) => {
  const { username, password } = requestToParams(req);
  queryUserByCredentials(username, password)
    .then(() => {
      resultHandler(res, {
        token: userDataToKey(username as string, password as string, true),
      });
    })
    .catch(errorHandler(res));
};

export const checkToken = (req: Request<{ token?: string }>, res: Response) => {
  queryUserByToken(req)
    .then(() => {
      resultHandler(res, { valid: true });
    })
    .catch(() => {
      resultHandler(res, { valid: false });
    });
};

// UPDATE

export const editUser = (req: Request<UserRequestParams>, res: Response) => {
  queryUserByToken(req)
    .then((user) => {
      const { fullName, logo } = requestToParams(req);
      return client
        .updateCollectionItemById<UserCollectionItemData>("users", user.id, {
          fullName,
          logo,
        })
        .then((user) => resultHandler(res, userToJson(user)));
    })
    .catch(errorHandler(res));
};

// DELETE

export const deleteUser = (req: Request<{ token?: string }>, res: Response) => {
  queryUserByToken(req)
    .then((user) => {
      const id = user.id;
      return client
        .deleteCollectionItemById(USERS_COLLECTION.name, id)
        .then(() => resultHandler(res, { success: true, id }));
    })
    .catch(errorHandler(res));
};
