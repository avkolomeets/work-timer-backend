import { Response } from "express";
import {
  TASKS_COLLECTION,
  TaskCollectionItemData,
  TaskRequestParams,
  taskDataFromReq,
  taskToJson,
} from "../models/task";
import { queryUserByToken } from "../utils/auth/user-util";
import { errorHandler } from "../utils/error-util";
import { client } from "../utils/query/client";
import { Request } from "../utils/query/interfaces";
import { requestToParams } from "../utils/query/request-util";
import { resultHandler } from "../utils/response-util";

// CREATE

export const addTask = (req: Request<TaskRequestParams>, res: Response) => {
  queryUserByToken(req)
    .then((user) => {
      const data = taskDataFromReq(req);
      if (!data.year) {
        return Promise.reject(new Error("year not specified"));
      }
      if (!data.month) {
        return Promise.reject(new Error("month not specified"));
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
        .getAllByIndexName(TASKS_COLLECTION.tasks_by_user_year_month, [
          user.name,
          +year,
          +month,
        ])
        .then((tasks: any) => resultHandler(res, tasks.data.map(taskToJson)));
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

export const editTask = (req: Request<TaskRequestParams>, res: Response) => {
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
