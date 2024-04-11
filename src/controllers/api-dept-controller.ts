import {
  createCollectionItem,
  deleteCollectionItemById,
  getAllByIndexName,
  updateCollectionItemById,
} from "../utils/query/fauna-query-util";
import { client } from "./client";
import { deptDataFromReq, deptToJson } from "../models/dept";
import { errorHandler } from "../utils/error-util";
import {
  CollectionItem,
  DeptCollectionItemData,
} from "models/intefaces-collections";
import { resultHandler } from "../utils/response-util";
import { userDataFromKey } from "../utils/auth/key-util";

type DeptQueryParams = {
  token: string;
};

const _queryDepts = (
  params: DeptQueryParams
): Promise<CollectionItem<DeptCollectionItemData>[]> => {
  const username = userDataFromKey(params.token).username;
  return client
    .query(getAllByIndexName("depts_by_user", username))
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
        .then((dept: CollectionItem<DeptCollectionItemData>) =>
          resultHandler(res, deptToJson(dept))
        )
        .catch(errorHandler(res));
    }
  });
};

// READ

export const getDept = (req, res) => {
  _queryDepts(req.query)
    .then((depts) => resultHandler(res, depts.map(deptToJson)[0] || {}))
    .catch(errorHandler(res));
};

// UPDATE

export const editDept = (req, res) => {
  _queryDepts(req.query).then((depts) => {
    if (depts.length) {
      const data = deptDataFromReq(req);
      client
        .query(updateCollectionItemById("depts", depts[0].ref.id, data))
        .then((dept: CollectionItem<DeptCollectionItemData>) =>
          res.json(deptToJson(dept))
        )
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
          .then((dept) => resultHandler(res, id))
          .catch(errorHandler(res));
      } else {
        throw new Error("item not found");
      }
    })
    .catch(errorHandler(res));
};
