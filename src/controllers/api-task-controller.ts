// CREATE

import { taskDataFromReq, taskToJson } from "../models/task";
import { errorHandler } from "../utils/error-util";
import {
  createCollectionItem,
  deleteCollectionItemById,
  getAllByIndexName,
  getCollectionItemById,
  updateCollectionItemById,
} from "../utils/fauna-query-util";
import { client } from "./client";

export const addTask = (req, res) => {
  const data = taskDataFromReq(req);
  if (!data.user) {
    errorHandler(res)(new Error("user not specified"));
    return;
  }
  if (!data.year) {
    errorHandler(res)(new Error("year not specified"));
    return;
  }
  if (!data.month) {
    errorHandler(res)(new Error("month not specified"));
    return;
  }
  client
    .query(createCollectionItem("tasks", data))
    .then((task) => res.status(200).json(taskToJson(task)))
    .catch(errorHandler(res));
};

// READ

export const getTasks = (req, res) => {
  const { user, year, month } = req.query;
  client
    .query(getAllByIndexName("tasks_by_user_year_month", [user, +year, +month]))
    .then((tasks: any) => res.status(200).json(tasks.data.map(taskToJson)))
    .catch(errorHandler(res));
};

export const getTask = (req, res) => {
  client
    .query(getCollectionItemById("tasks", req.params.id))
    .then((task) => res.status(200).json(taskToJson(task)))
    .catch(errorHandler(res));
};

// UPDATE

export const editTask = (req, res) => {
  const data = taskDataFromReq(req);
  client
    .query(updateCollectionItemById("tasks", req.params.id, data))
    .then((task) => res.json(taskToJson(task)))
    .catch(errorHandler(res));
};

// DELETE

export const deleteTask = (req, res) => {
  const { id } = req.params;
  client
    .query(deleteCollectionItemById("tasks", id))
    .then((task) => res.status(200).json(id))
    .catch(errorHandler(res));
};
