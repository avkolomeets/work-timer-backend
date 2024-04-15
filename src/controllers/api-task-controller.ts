import { Response } from "express";
import {
  TASKS_COLLECTION,
  TaskCollectionItemData,
  TaskRequestParams,
  taskDataFromReq,
  taskToJson,
} from "../models/task";
import { queryUserByToken } from "../utils/auth/user-util";
import { client } from "../utils/query/client";
import { Request } from "../utils/query/interfaces";
import { requestToParams } from "../utils/query/request-util";
import { errorHandler } from "../utils/response/error-util";
import { resultHandler } from "../utils/response/result-util";

// CREATE

export const createTask = (req: Request<TaskRequestParams>, res: Response) => {
  queryUserByToken(req)
    .then((user) => {
      const data = taskDataFromReq(req);
      if (!data.year) {
        return Promise.reject(new Error("`year` is required."));
      }
      if (!data.month) {
        return Promise.reject(new Error("`month` is required."));
      }
      return client
        .createCollectionItem<TaskCollectionItemData>(TASKS_COLLECTION.name, {
          user: user.name,
          ...data,
        })
        .then((task) => resultHandler(res, taskToJson(task)));
    })
    .catch(errorHandler(res));
};

// READ

export const getTasks = (req: Request<TaskRequestParams>, res: Response) => {
  queryUserByToken(req)
    .then((user) => {
      const { year, month } = requestToParams(req);
      if (!year) {
        return Promise.reject(new Error("`year` is required."));
      }
      if (!month) {
        return Promise.reject(new Error("`month` is required."));
      }
      return client
        .getAllByIndexName<TaskCollectionItemData>(
          TASKS_COLLECTION.tasks_by_user_year_month,
          [user.name, +year, +month]
        )
        .then((tasks) => resultHandler(res, tasks.map(taskToJson)));
    })
    .catch(errorHandler(res));
};

export const getTask = (req: Request<TaskRequestParams>, res: Response) => {
  queryUserByToken(req)
    .then(() => {
      const id = req.params.id;
      return client
        .getCollectionItemById<TaskCollectionItemData>(
          TASKS_COLLECTION.name,
          id
        )
        .then((task) => resultHandler(res, taskToJson(task)));
    })
    .catch(errorHandler(res));
};

// UPDATE

export const updateTask = (req: Request<TaskRequestParams>, res: Response) => {
  queryUserByToken(req)
    .then(() => {
      const id = req.params.id;
      const data = taskDataFromReq(req);
      return client
        .updateCollectionItemById<TaskCollectionItemData>(
          TASKS_COLLECTION.name,
          id,
          data
        )
        .then((task) => resultHandler(res, taskToJson(task)));
    })
    .catch(errorHandler(res));
};

// DELETE

export const deleteTask = (req: Request<TaskRequestParams>, res: Response) => {
  queryUserByToken(req)
    .then(() => {
      const id = req.params.id;
      return client
        .deleteCollectionItemById(TASKS_COLLECTION.name, id)
        .then(() => resultHandler(res, { success: true, id }));
    })
    .catch(errorHandler(res));
};
