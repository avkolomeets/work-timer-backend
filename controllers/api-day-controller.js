const { client } = require("./client");
const {
  getAllByIndexName,
  createCollectionItem,
  deleteCollectionItemById,
  updateCollectionItemById,
} = require("../utils/fauna-query-util");
const { errorHandler } = require("../utils/error-util");
const { removeUndefinedProperties } = require("../utils/json-util");
const { toNumberOrUndefined } = require("../utils/number-util");

const _dayToJson = (day) => {
  return {
    ...day.data,
  };
};

const _toDataFromReq = (req) => {
  const _toParams = (params) => {
    const { user, year, month, day, time, workIntervals } = params;
    return removeUndefinedProperties({
      user,
      year: toNumberOrUndefined(year),
      month: toNumberOrUndefined(month),
      day: toNumberOrUndefined(day),
      time: toNumberOrUndefined(time),
      workIntervals:
        workIntervals == null
          ? workIntervals
          : typeof workIntervals === "string"
          ? JSON.parse(workIntervals)
          : workIntervals,
    });
  };
  return { ..._toParams(req.query), ..._toParams(req.body) };
};

const _queryDays = (params, singleAction) => {
  if (!params.user) {
    return Promise.reject(new Error("user not specified"));
  }

  const { user, year, month, day } = params;
  if (day == null && singleAction === "return-empty") {
    return Promise.resolve([]);
  }
  if (day == null && singleAction === "require") {
    Promise.reject(new Error("day is not specified"));
  }
  const indexName =
    day != null ? "days_by_user_year_month_day" : "days_by_user_year_month";
  const matchParams =
    day != null ? [user, +year, +month, +day] : [user, +year, +month];
  return client
    .query(getAllByIndexName(indexName, matchParams))
    .then((r) => r.data || []);
};

// CREATE

const addDay = (req, res) => {
  _queryDays(req.query, "require")
    .then((days) => {
      if (days.length) {
        editDay(req, res);
      } else {
        const data = _toDataFromReq(req);
        client
          .query(createCollectionItem("days", data))
          .then((day) => res.status(200).json(_dayToJson(day)))
          .catch(errorHandler(res));
      }
    })
    .catch(errorHandler(res));
};

// READ

const getDays = (req, res) => {
  _queryDays(req.query)
    .then((days) => res.status(200).json(days.map(_dayToJson)))
    .catch(errorHandler(res));
};

const getDay = (req, res) => {
  _queryDays(req.query, "return-empty")
    .then((days) => res.status(200).json(days.map(_dayToJson)[0]))
    .catch(errorHandler(res));
};

// UPDATE

const editDay = (req, res) => {
  _queryDays(req.query, "require")
    .then((days) => {
      if (days.length) {
        const data = _toDataFromReq(req);
        client
          .query(updateCollectionItemById("days", days[0].ref.id, data))
          .then((day) => res.json(_dayToJson(day)))
          .catch(errorHandler(res));
      } else {
        addDay(req, res);
      }
    })
    .catch(errorHandler(res));
};

// DELETE

const deleteDay = (req, res) => {
  _queryDays(req.query, "require")
    .then((days) => {
      if (days.length) {
        const id = days[0].ref.id;
        client
          .query(deleteCollectionItemById("days", id))
          .then((day) => res.status(200).json(id))
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
