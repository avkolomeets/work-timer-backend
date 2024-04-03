const faunadb = require("faunadb");
const { client } = require("./client");
const q = faunadb.query;

const _handleError = (res, error) => {
  res.status(500).send(error.message);
};

const _taskToJson = (task) => {
  return {
    id: task.ref.id,
    ...task.data,
  };
};

const _taskDataFromBody = (req) => {
  const { link, label, time, type, created, modified, user } = req.body;
  return { link, label, time, type, created, modified, user };
};

const getTasks = (req, res) => {
  client
    .query(
      q.Map(
        q.Paginate(q.Match(q.Index("tasks_by_user"), req.query.user)),
        q.Lambda("X", q.Get(q.Var("X")))
      )
    )
    .then((tasks) => res.status(200).json(tasks.data.map(_taskToJson)))
    .catch((error) => _handleError(res, error));
};

const addTask = (req, res) => {
  const data = _taskDataFromBody(req);
  client
    .query(q.Create(q.Collection("tasks"), { data }))
    .then((task) => res.status(200).json(_taskToJson(task)))
    .catch((error) => _handleError(res, error));
};

const getTask = (req, res) => {
  client
    .query(q.Get(q.Ref(q.Collection("tasks"), req.params.id)))
    .then((task) => res.status(200).json(_taskToJson(task)))
    .catch((error) => _handleError(res, error));
};

const deleteTask = (req, res) => {
  const { id } = req.params;
  client
    .query(q.Delete(q.Ref(q.Collection("tasks"), id)))
    .then((task) => res.status(200).json(id))
    .catch((error) => _handleError(res, error));
};

const editTask = (req, res) => {
  const data = _taskDataFromBody(req);
  client
    .query(q.Update(q.Ref(q.Collection("tasks"), req.params.id), { data }))
    .then((task) => res.json(_taskToJson(task)))
    .catch((error) => _handleError(res, error));
};

module.exports = {
  getTasks,
  addTask,
  getTask,
  deleteTask,
  editTask,
};
