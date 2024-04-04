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
const { toNumberOrUndefined } = require("../utils/number-util");

const _taskToJson = (task) => {
  return {
    id: task.ref.id,
    ...task.data,
  };
};

const _taskDataFromReq = (req) => {
  const _toParams = (params) => {
    const { link, label, time, type, created, modified, user } = params;
    return removeUndefinedProperties({
      user,
      link,
      label,
      time: toNumberOrUndefined(time),
      type,
      created: toNumberOrUndefined(created),
      modified: toNumberOrUndefined(modified),
    });
  };
  return { ..._toParams(req.query), ..._toParams(req.body) };
};

// CREATE

const addTask = (req, res) => {
  const data = _taskDataFromReq(req);
  if (!data.user) {
    errorHandler(res)(new Error("user not specified"));
    return;
  }
  client
    .query(createCollectionItem("tasks", data))
    .then((task) => res.status(200).json(_taskToJson(task)))
    .catch(errorHandler(res));
};

// READ

const getTasks = (req, res) => {
  client
    .query(getAllByIndexName("tasks_by_user", req.query.user))
    .then((tasks) => res.status(200).json(tasks.data.map(_taskToJson)))
    .catch(errorHandler(res));
};

const getTask = (req, res) => {
  client
    .query(getCollectionItemById("tasks", req.params.id))
    .then((task) => res.status(200).json(_taskToJson(task)))
    .catch(errorHandler(res));
};

// UPDATE

const editTask = (req, res) => {
  const data = _taskDataFromReq(req);
  client
    .query(updateCollectionItemById("tasks", req.params.id, data))
    .then((task) => res.json(_taskToJson(task)))
    .catch(errorHandler(res));
};

// DELETE

const deleteTask = (req, res) => {
  const { id } = req.params;
  client
    .query(deleteCollectionItemById("tasks", id))
    .then((task) => res.status(200).json(id))
    .catch(errorHandler(res));
};

module.exports = {
  getTasks,
  addTask,
  getTask,
  deleteTask,
  editTask,
};
