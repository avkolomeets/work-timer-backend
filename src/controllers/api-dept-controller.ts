import { Response } from "express";
import { CollectionItem } from "models/intefaces-collections";
import {
  DeptCollectionItemData,
  DeptRequestParams,
  deptDataFromReq,
  deptToJson,
} from "../models/dept";
import { queryUserByToken } from "../utils/auth/user-util";
import { errorHandler } from "../utils/error-util";
import { client } from "../utils/query/client";
import { Request } from "../utils/query/interfaces";
import { resultHandler } from "../utils/response-util";

const _queryDepts = (
  username: string
): Promise<CollectionItem<DeptCollectionItemData>[]> => {
  return client.getAllByIndexName("depts_by_user", username);
};

// CREATE

export const addDept = (req: Request<DeptRequestParams>, res: Response) => {
  queryUserByToken(req)
    .then((user) => {
      return _queryDepts(user.name).then((depts) => {
        if (depts.length) {
          editDept(req, res);
        } else {
          const data = deptDataFromReq(req);
          return client
            .createCollectionItem<DeptCollectionItemData>("depts", {
              user: user.name,
              ...data,
            })
            .then((dept) => resultHandler(res, deptToJson(dept)));
        }
      });
    })
    .catch(errorHandler(res));
};

// READ

export const getDept = (req: Request<DeptRequestParams>, res: Response) => {
  queryUserByToken(req)
    .then((user) => {
      return _queryDepts(user.name).then((depts) =>
        resultHandler(res, depts.map(deptToJson)[0] || {})
      );
    })
    .catch(errorHandler(res));
};

// UPDATE

export const editDept = (req: Request<DeptRequestParams>, res: Response) => {
  queryUserByToken(req)
    .then((user) => {
      return _queryDepts(user.name).then((depts) => {
        if (depts.length) {
          const data = deptDataFromReq(req);
          return client
            .updateCollectionItemById<DeptCollectionItemData>(
              "depts",
              depts[0].ref.id,
              data
            )
            .then((dept) => res.json(deptToJson(dept)));
        } else {
          addDept(req, res);
        }
      });
    })
    .catch(errorHandler(res));
};

// DELETE

export const deleteDept = (req: Request<DeptRequestParams>, res: Response) => {
  queryUserByToken(req)
    .then((user) => {
      return _queryDepts(user.name).then((depts) => {
        if (depts.length) {
          const id = depts[0].ref.id;
          return client
            .deleteCollectionItemById("depts", id)
            .then(() => resultHandler(res, id));
        } else {
          return Promise.reject(new Error("item not found"));
        }
      });
    })
    .catch(errorHandler(res));
};
