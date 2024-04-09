import {
  createCollectionItem,
  deleteCollectionItemById,
  getAllByIndexName,
  updateCollectionItemById,
} from "utils/fauna-query-util";
import { client } from "./client";
import { dayDataFromReq, dayToJson } from "models/day";
import { errorHandler } from "utils/error-util";

const _queryDays = (params, singleAction?) => {
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
    .then((r: any) => r.data || []);
};

// CREATE

export const addDay = (req, res) => {
  _queryDays(req.query, "require")
    .then((days) => {
      if (days.length) {
        editDay(req, res);
      } else {
        const data = dayDataFromReq(req);
        client
          .query(createCollectionItem("days", data))
          .then((day) => res.status(200).json(dayToJson(day)))
          .catch(errorHandler(res));
      }
    })
    .catch(errorHandler(res));
};

// READ

export const getDays = (req, res) => {
  _queryDays(req.query)
    .then((days) => res.status(200).json(days.map(dayToJson)))
    .catch(errorHandler(res));
};

const getDay = (req, res) => {
  _queryDays(req.query, "return-empty")
    .then((days) => res.status(200).json(days.map(dayToJson)[0]))
    .catch(errorHandler(res));
};

// UPDATE

export const editDay = (req, res) => {
  _queryDays(req.query, "require")
    .then((days) => {
      if (days.length) {
        const data = dayDataFromReq(req);
        client
          .query(updateCollectionItemById("days", days[0].ref.id, data))
          .then((day) => res.json(dayToJson(day)))
          .catch(errorHandler(res));
      } else {
        addDay(req, res);
      }
    })
    .catch(errorHandler(res));
};

// DELETE

export const deleteDay = (req, res) => {
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
