import { Response } from "express";
import { CollectionItem } from "models/intefaces-collections";
import {
  DEPTS_COLLECTION,
  DeptCollectionItemData,
  DeptRequestParams,
  deptDataFromReq,
  deptToJson,
} from "../models/dept";
import { queryUserByToken } from "../utils/auth/user-util";
import { client } from "../utils/query/client";
import { Request } from "../utils/query/interfaces";
import {
  CustomError,
  ERROR_CODES,
  errorHandler,
} from "../utils/response/error-util";
import { resultHandler } from "../utils/response/result-util";

const _queryDepts = (
  username: string
): Promise<CollectionItem<DeptCollectionItemData>[]> => {
  return client.getAllByIndexName(DEPTS_COLLECTION.depts_by_user, username);
};

// CREATE

export const createDept = (req: Request<DeptRequestParams>, res: Response) => {
  queryUserByToken(req)
    .then((user) => {
      return _queryDepts(user.name).then((depts) => {
        if (depts.length) {
          updateOrCreateDept(req, res);
        } else {
          const data = deptDataFromReq(req);
          return client
            .createCollectionItem<DeptCollectionItemData>(
              DEPTS_COLLECTION.name,
              {
                user: user.name,
                ...data,
              }
            )
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

export const updateOrCreateDept = (
  req: Request<DeptRequestParams>,
  res: Response
) => {
  queryUserByToken(req)
    .then((user) => {
      return _queryDepts(user.name).then((depts) => {
        if (depts.length) {
          const data = deptDataFromReq(req);
          return client
            .updateCollectionItemById<DeptCollectionItemData>(
              DEPTS_COLLECTION.name,
              depts[0].ref.id,
              data
            )
            .then((dept) => resultHandler(res, deptToJson(dept)));
        } else {
          createDept(req, res);
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
            .deleteCollectionItemById(DEPTS_COLLECTION.name, id)
            .then(() => resultHandler(res, { success: true }));
        } else {
          return Promise.reject(
            new CustomError("item not found", ERROR_CODES.notFound)
          );
        }
      });
    })
    .catch(errorHandler(res));
};
