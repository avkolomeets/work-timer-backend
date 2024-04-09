import {
  createCollectionItem,
  deleteCollectionItemById,
  getAllByIndexName,
  updateCollectionItemById,
} from "../utils/fauna-query-util";
import { client } from "./client";
import { deptDataFromReq, deptToJson } from "../models/dept";
import { errorHandler } from "../utils/error-util";

const _queryDepts = (params) => {
  if (!params.user) {
    return Promise.reject(new Error("user not specified"));
  }

  return client
    .query(getAllByIndexName("depts_by_user", params.user))
    .then((r: any) => r.data || []);
};

// CREATE

export const addDept = (req, res) => {
  _queryDepts(req.query).then((depts) => {
    if (depts.length) {
      editDept(req, res);
    } else {
      const data = deptDataFromReq(req);
      client
        .query(createCollectionItem("depts", data))
        .then((dept) => res.status(200).json(deptToJson(dept)))
        .catch(errorHandler(res));
    }
  });
};

// READ

export const getDept = (req, res) => {
  _queryDepts(req.query)
    .then((depts) => res.status(200).json(depts.map(deptToJson)[0] || {}))
    .catch(errorHandler(res));
};

// UPDATE

export const editDept = (req, res) => {
  _queryDepts(req.query).then((depts) => {
    if (depts.length) {
      const data = deptDataFromReq(req);
      client
        .query(updateCollectionItemById("depts", depts[0].ref.id, data))
        .then((dept) => res.json(deptToJson(dept)))
        .catch(errorHandler(res));
    } else {
      addDept(req, res);
    }
  });
};

// DELETE

export const deleteDept = (req, res) => {
  _queryDepts(req.query)
    .then((depts) => {
      if (depts.length) {
        const id = depts[0].ref.id;
        client
          .query(deleteCollectionItemById("depts", id))
          .then((dept) => res.status(200).json(id))
          .catch(errorHandler(res));
      } else {
        throw new Error("item not found");
      }
    })
    .catch(errorHandler(res));
};
