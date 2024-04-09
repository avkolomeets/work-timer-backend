import {
  createCollectionItem,
  deleteCollectionItemById,
  getAllByIndexName,
  updateCollectionItemById,
} from "../utils/fauna-query-util";
import { client } from "./client";
import { userDataFromReq, userToJson } from "../models/user";
import { errorHandler } from "../utils/error-util";

const _queryUsers = (params) => {
  if (!params.user) {
    return Promise.reject(new Error("user not specified"));
  }

  return client
    .query(getAllByIndexName("users_by_name", params.user))
    .then((r: any) => r.data || []);
};

// CREATE

export const addUser = (req, res) => {
  _queryUsers(req.query).then((users) => {
    if (users.length) {
      editUser(req, res);
    } else {
      const data = userDataFromReq(req);
      client
        .query(createCollectionItem("users", data))
        .then((user) => res.status(200).json(userToJson(user)))
        .catch(errorHandler(res));
    }
  });
};

// READ

export const getUser = (req, res) => {
  _queryUsers(req.query)
    .then((users) => res.status(200).json(users.map(userToJson)[0] || {}))
    .catch(errorHandler(res));
};

// UPDATE

export const editUser = (req, res) => {
  _queryUsers(req.query).then((users) => {
    if (users.length) {
      const data = userDataFromReq(req);
      client
        .query(updateCollectionItemById("users", users[0].ref.id, data))
        .then((user) => res.json(userToJson(user)))
        .catch(errorHandler(res));
    } else {
      addUser(req, res);
    }
  });
};

// DELETE

export const deleteUser = (req, res) => {
  _queryUsers(req.query)
    .then((users) => {
      if (users.length) {
        const id = users[0].ref.id;
        client
          .query(deleteCollectionItemById("users", id))
          .then((user) => res.status(200).json(id))
          .catch(errorHandler(res));
      } else {
        throw new Error("item not found");
      }
    })
    .catch(errorHandler(res));
};
