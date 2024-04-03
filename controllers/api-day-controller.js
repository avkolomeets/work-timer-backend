const { client } = require("./client");
const {
  getAllByIndexName,
  createCollectionItem,
  deleteCollectionItemById,
  updateCollectionItemById,
} = require("../utils/fauna-query-util");
const { errorHandler } = require("../utils/error-util");

const _dayToJson = (day) => {
  return {
    ...day.data,
  };
};

const _dayDataFromBody = (req) => {
  const { user, year, month, day, time, workIntervals } = req.body;
  return { user, year, month, day, time, workIntervals };
};

const _queryDays = (params, singleAction) => {
  console.log({ ...params });
  const { user, year, month, day } = params;
  if (day == null && singleAction === "return-empty") {
    return Promise.resolve({ data: [] });
  }
  if (day == null && singleAction === "require") {
    throw new Error("day is not specified");
  }
  const indexName =
    day != null ? "days_by_user_year_month_day" : "days_by_user_year_month";
  const matchParams =
    day != null ? [user, +year, +month, +day] : [user, +year, +month];
  return client.query(getAllByIndexName(indexName, matchParams));
};

const getDays = (req, res) => {
  _queryDays(req.query)
    .then((days) => res.status(200).json(days.data.map(_dayToJson)))
    .catch(errorHandler(res));
};

const addDay = (req, res) => {
  _queryDays(req.query, "require")
    .then((days) => {
      if (days.length) {
        editDay(req, res);
      } else {
        const data = _dayDataFromBody(req);
        client
          .query(createCollectionItem("days", data))
          .then((day) => res.status(200).json(_dayToJson(day)))
          .catch(errorHandler(res));
      }
    })
    .catch(errorHandler(res));
};

const getDay = (req, res) => {
  _queryDays(req.query, "return-empty")
    .then((days) => res.status(200).json(days.data.map(_dayToJson)[0]))
    .catch(errorHandler(res));
};

const deleteDay = (req, res) => {
  _queryDays(req.query, "require")
    .then((days) => {
      if (days.length) {
        const id = days[0].id;
        client
          .query(deleteCollectionItemById("days", id))
          .then((day) => res.status(200).json(id))
          .catch(errorHandler(res));
      }
    })
    .catch(errorHandler(res));
};

const editDay = (req, res) => {
  _queryDays(req.query, "require")
    .then((days) => {
      if (days.length) {
        const data = _dayDataFromBody(req);
        client
          .query(updateCollectionItemById("days", days[0].id, data))
          .then((day) => res.json(_dayToJson(day)))
          .catch(errorHandler(res));
      }
    })
    .catch(errorHandler(res));
};

module.exports = {
  getDays,
  addDay,
  getDay,
  deleteDay,
  editDay,
};
