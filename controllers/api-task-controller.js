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
    const { year, month, link, label, time, type, created, modified, user } =
      params;
    return removeUndefinedProperties({
      user,
      year: toNumberOrUndefined(year),
      month: toNumberOrUndefined(month),
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
    .then((task) => res.status(200).json(_taskToJson(task)))
    .catch(errorHandler(res));
};

// READ

const getTasks = (req, res) => {
  const { user, year, month } = req.query;
  client
    .query(getAllByIndexName("tasks_by_user_year_month", [user, +year, +month]))
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
