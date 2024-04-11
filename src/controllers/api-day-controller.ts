import {
  createCollectionItem,
  deleteCollectionItemById,
  getAllByIndexName,
  updateCollectionItemById,
} from "../utils/query/fauna-query-util";
import {
  DayCollectionItemData,
  DayRequestParams,
  dayDataFromReq,
  dayToJson,
} from "../models/day";
import { errorHandler } from "../utils/error-util";
import { CollectionItem } from "models/intefaces-collections";
import { resultHandler } from "../utils/response-util";
import { userDataFromKey } from "../utils/auth/key-util";
import { client } from "utils/query/client";
import { Response } from "express";
import { Request } from "utils/query/interfaces";

const _queryDays = (
  req: Request<DayRequestParams>,
  singleAction?: "return-empty" | "require"
): Promise<CollectionItem<DayCollectionItemData>[]> => {
  const username = userDataFromKey(params.token).username;
  const { year, month, day } = params;
  if (day == null && singleAction === "return-empty") {
    return Promise.resolve([]);
  }
  if (day == null && singleAction === "require") {
    Promise.reject(new Error("day is not specified"));
  }
  const indexName =
    day != null ? "days_by_user_year_month_day" : "days_by_user_year_month";
  const matchParams =
    day != null ? [username, +year, +month, +day] : [username, +year, +month];
  return client.getAllByIndexName(indexName, matchParams);
};

// CREATE

export const addDay = (req: Request<DayRequestParams>, res: Response) => {
  _queryDays(req, "require")
    .then((days) => {
      if (days.length) {
        editDay(req, res);
      } else {
        const data = dayDataFromReq(req) as DayCollectionItemData;
        client
          .createCollectionItem("days", data)
          .then((day) => resultHandler(res, dayToJson(day)))
          .catch(errorHandler(res));
      }
    })
    .catch(errorHandler(res));
};

// READ

export const getDays = (req: Request<DayRequestParams>, res: Response) => {
  _queryDays(req)
    .then((days) => resultHandler(res, days.map(dayToJson)))
    .catch(errorHandler(res));
};

export const getDay = (req: Request<DayRequestParams>, res: Response) => {
  _queryDays(req, "return-empty")
    .then((days) => resultHandler(res, days.map(dayToJson)[0]))
    .catch(errorHandler(res));
};

// UPDATE

export const editDay = (req: Request<DayRequestParams>, res: Response) => {
  _queryDays(req, "require")
    .then((days) => {
      if (days.length) {
        const data = dayDataFromReq(req) as DayCollectionItemData;
        client
          .updateCollectionItemById("days", days[0].ref.id, data)
          .then((day) => resultHandler(res, dayToJson(day)))
          .catch(errorHandler(res));
      } else {
        addDay(req, res);
      }
    })
    .catch(errorHandler(res));
};

// DELETE

export const deleteDay = (req: Request<DayRequestParams>, res: Response) => {
  _queryDays(req, "require")
    .then((days) => {
      if (days.length) {
        const id = days[0].ref.id;
        client
          .deleteCollectionItemById("days", id)
          .then(() => resultHandler(res, id))
          .catch(errorHandler(res));
      } else {
        errorHandler(res)(new Error("day not found"));
      }
    })
    .catch(errorHandler(res));
};
