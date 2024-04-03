const { client } = require("./client");
const {
  getAllByIndexName,
  createCollectionItem,
  getCollectionItemById,
  deleteCollectionItemById,
  updateCollectionItemById,
} = require("../utils/fauna-query-util");
const { errorHandler } = require("../utils/error-util");
const { removeUndefinedProperties } = require("../utils/json-util");

const _taskToJson = (task) => {
  return {
    id: task.ref.id,
    ...task.data,
  };
};

const _taskDataFromBody = (req) => {
  const { link, label, time, type, created, modified, user } = req.body;
  return removeUndefinedProperties({
    user,
    link,
    label,
    time: time != null ? +time : time,
    type,
    created: created != null ? +created : created,
    modified: modified != null ? +modified : modified,
  });
};

const getTasks = (req, res) => {
  client
    .query(getAllByIndexName("tasks_by_user", req.query.user))
    .then((tasks) => res.status(200).json(tasks.data.map(_taskToJson)))
    .catch(errorHandler(res));
};

const addTask = (req, res) => {
  const data = _taskDataFromBody(req);
  if (!data.user) {
    errorHandler(res)(new Error("user not specified"));
    return;
  }
  client
    .query(createCollectionItem("tasks", data))
    .then((task) => res.status(200).json(_taskToJson(task)))
    .catch(errorHandler(res));
};

const getTask = (req, res) => {
  client
    .query(getCollectionItemById("tasks", req.params.id))
    .then((task) => res.status(200).json(_taskToJson(task)))
    .catch(errorHandler(res));
};

const deleteTask = (req, res) => {
  const { id } = req.params;
  client
    .query(deleteCollectionItemById("tasks", id))
    .then((task) => res.status(200).json(id))
    .catch(errorHandler(res));
};

const editTask = (req, res) => {
  const data = _taskDataFromBody(req);
  client
    .query(updateCollectionItemById("tasks", req.params.id, data))
    .then((task) => res.json(_taskToJson(task)))
    .catch(errorHandler(res));
};

module.exports = {
  getTasks,
  addTask,
  getTask,
  deleteTask,
  editTask,
};
