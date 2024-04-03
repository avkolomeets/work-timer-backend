const faunadb = require("faunadb");
const { client } = require("./client");
const q = faunadb.query;

const _handleError = (res, error) => {
  res.status(500).send(error.message);
};

const _dayToJson = (day) => {
  return {
    id: day.ref.id,
    ...day.data,
  };
};

const _dayDataFromBody = (req) => {
  const { user, year, month, day, time, workIntervals } = req.body;
  return { user, year, month, day, time, workIntervals };
};

const _queryDays = (params) => {
  const { user, year, month, day } = params;
  const indexName =
    day != null ? "days_by_user_year_month_day" : "days_by_user_year_month";
  const matchParams =
    day != null ? [user, year, month, day] : [user, year, month];
  return client.query(
    q.Map(
      q.Paginate(q.Match(q.Index(indexName), matchParams)),
      q.Lambda("X", q.Get(q.Var("X")))
    )
  );
};

const getDays = (req, res) => {
  _queryDays(req.query)
    .then((days) => res.status(200).json(days.data.map(_dayToJson)))
    .catch((error) => _handleError(res, error));
};

const addDay = (req, res) => {
  _queryDays(req.query).then((days) => {
    if (days.length) {
      editDay(req, res);
    } else {
      const data = _dayDataFromBody(req);
      client
        .query(q.Create(q.Collection("days"), { data }))
        .then((day) => res.status(200).json(_dayToJson(day)))
        .catch((error) => _handleError(res, error));
    }
  });
};

const getDay = (req, res) => {
  client
    .query(q.Get(q.Ref(q.Collection("days"), req.params.id)))
    .then((day) => res.status(200).json(_dayToJson(day)))
    .catch((error) => _handleError(res, error));
};

const deleteDay = (req, res) => {
  const { id } = req.params;
  client
    .query(q.Delete(q.Ref(q.Collection("days"), id)))
    .then((day) => res.status(200).json(id))
    .catch((error) => _handleError(res, error));
};

const editDay = (req, res) => {
  const data = _dayDataFromBody(req);
  client
    .query(q.Update(q.Ref(q.Collection("days"), req.params.id), { data }))
    .then((day) => res.json(_dayToJson(day)))
    .catch((error) => _handleError(res, error));
};

module.exports = {
  getDays,
  addDay,
  getDay,
  deleteDay,
  editDay,
};
