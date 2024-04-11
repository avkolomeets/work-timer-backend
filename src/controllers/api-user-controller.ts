import { CollectionItem } from "models/intefaces-collections";
import { userDataFromReq, userToJson } from "../models/user";
import { userDataFromKey, userDataToKey } from "../utils/auth/key-util";
import { errorHandler } from "../utils/error-util";
import { removeMissingProperties } from "../utils/json-util";
import {
  createCollectionItem,
  deleteCollectionItemById,
  updateCollectionItemById,
} from "../utils/query/fauna-query-util";
import { resultHandler } from "../utils/response-util";

// CREATE

export const addUser = (req, res) => {
  _queryUser(req.query).then((user) => {
    if (user) {
      errorHandler(res)(new Error(`User #${user.data.name} already exists`));
    } else {
      const { username, fullName, password, logo } = userDataFromReq(req);
      if (!username) {
        errorHandler(res)(new Error("username name is not specified"));
        return;
      }
      if (!fullName) {
        errorHandler(res)(new Error("fullName is not specified"));
        return;
      }
      if (!password) {
        errorHandler(res)(new Error("password is not specified"));
        return;
      }
      const data: UserCollectionItemData = {
        name: username,
        fullName,
        key: userDataToKey(username, password),
        logo,
      };
      client
        .query(createCollectionItem("users", removeMissingProperties(data)))
        .then((user: CollectionItem<UserCollectionItemData>) =>
          resultHandler(res, userToJson(user))
        )
        .catch(errorHandler(res));
    }
  });
};

// READ

export const getUser = (req, res) => {
  _queryUser(req.query)
    .then((user) => resultHandler(res, user ? userToJson(user) : {}))
    .catch(errorHandler(res));
};

export const checkUserName = (req, res) => {
  _queryUser(req.query)
    .then((user) => resultHandler(res, { exists: !!user }))
    .catch(errorHandler(res));
};

export const getToken = (req, res) => {
  _queryUser(req.query).then((user) => {
    if (!user) {
      errorHandler(res)(
        new Error(`User #${user.data.name} doesn't exist exists`)
      );
    } else {
      const { username, password } = userDataFromReq(req);
      if (!password) {
        errorHandler(res)(new Error("password is not specified"));
        return;
      }
      if (userDataFromKey(user.data.key).password !== password) {
        errorHandler(res)(new Error("password is invalid"));
        return;
      }
      resultHandler(res, { token: userDataToKey(username, password, true) });
    }
  });
};

export const checkToken = (req, res) => {
  const username = userDataFromKey(req.query.token).username;
  ___queryUser(req.query).then((user) => {
    if (!user) {
      errorHandler(res)(
        new Error(`User #${user.data.name} doesn't exist exists`)
      );
    } else {
      const { username, password } = userDataFromReq(req);
      if (!password) {
        errorHandler(res)(new Error("password is not specified"));
        return;
      }
      if (userDataFromKey(user.data.key).password !== password) {
        errorHandler(res)(new Error("password is invalid"));
        return;
      }
      resultHandler(res, { token: userDataToKey(username, password, true) });
    }
  });
};

// UPDATE

export const editUser = (req, res) => {
  _queryUser(req.query).then((user) => {
    if (!user) {
      errorHandler(res)(new Error(`User #${user.data.name} does not exists`));
    } else {
      const { fullName, logo } = userDataFromReq(req);
      client
        .query(
          updateCollectionItemById(
            "users",
            user.ref.id,
            removeMissingProperties({ fullName, logo })
          )
        )
        .then((user: CollectionItem<UserCollectionItemData>) =>
          res.json(userToJson(user))
        )
        .catch(errorHandler(res));
    }
  });
};

// DELETE

export const deleteUser = (req, res) => {
  _queryUser(req.query).then((user) => {
    if (!user) {
      errorHandler(res)(new Error(`User #${user.data.name} does not exists`));
    } else {
      const id = user.ref.id;
      client
        .query(deleteCollectionItemById("users", id))
        .then((user) => resultHandler(res, id))
        .catch(errorHandler(res));
    }
  });
};
