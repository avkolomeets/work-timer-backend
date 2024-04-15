import { Response } from "express";
import {
  DAYS_COLLECTION,
  DayCollectionItemData,
  DayRequestParams,
  dayDataFromReq,
  dayToJson,
} from "../models/day";
import { CollectionItem } from "../models/intefaces-collections";
import { queryUserByToken } from "../utils/auth/user-util";
import { client } from "../utils/query/client";
import { Request } from "../utils/query/interfaces";
import { requestToParams } from "../utils/query/request-util";
import {
  CustomError,
  ERROR_CODES,
  errorHandler,
} from "../utils/response/error-util";
import { resultHandler } from "../utils/response/result-util";

const _queryDays = (
  req: Request<DayRequestParams>,
  username: string,
  singleAction: "return-empty" | "require" | null
): Promise<CollectionItem<DayCollectionItemData>[]> => {
  const { year, month, day } = requestToParams(req);
  if (day == null && singleAction === "return-empty") {
    return Promise.resolve([]);
  }
  if (day == null && singleAction === "require") {
    return Promise.reject(new Error("`day` is required."));
  }
  if (!year) {
    return Promise.reject(new Error("`year` is required."));
  }
  if (!month) {
    return Promise.reject(new Error("`month` is required."));
  }
  const indexName =
    day != null
      ? DAYS_COLLECTION.days_by_user_year_month_day
      : DAYS_COLLECTION.days_by_user_year_month;
  const matchParams =
    day != null ? [username, +year, +month, +day] : [username, +year, +month];
  return client.getAllByIndexName(indexName, matchParams);
};

// CREATE

export const createDay = (req: Request<DayRequestParams>, res: Response) => {
  queryUserByToken(req)
    .then((user) => {
      return _queryDays(req, user.name, "require").then((days) => {
        if (days.length) {
          updateOrCreateDay(req, res);
        } else {
          const data = dayDataFromReq(req);
          return client
            .createCollectionItem<DayCollectionItemData>("days", {
              user: user.name,
              ...data,
            })
            .then((day) => resultHandler(res, dayToJson(day)));
        }
      });
    })
    .catch(errorHandler(res));
};

// READ

export const getDays = (req: Request<DayRequestParams>, res: Response) => {
  queryUserByToken(req)
    .then((user) => {
      return _queryDays(req, user.name, null).then((days) =>
        resultHandler(res, days.map(dayToJson))
      );
    })
    .catch(errorHandler(res));
};

export const getDay = (req: Request<DayRequestParams>, res: Response) => {
  queryUserByToken(req)
    .then((user) => {
      return _queryDays(req, user.name, "return-empty").then((days) =>
        resultHandler(res, days.map(dayToJson)[0])
      );
    })
    .catch(errorHandler(res));
};

// UPDATE

export const updateOrCreateDay = (
  req: Request<DayRequestParams>,
  res: Response
) => {
  queryUserByToken(req)
    .then((user) => {
      return _queryDays(req, user.name, "require").then((days) => {
        if (days.length) {
          const data = dayDataFromReq(req);
          return client
            .updateCollectionItemById<DayCollectionItemData>(
              DAYS_COLLECTION.name,
              days[0].ref.id,
              data
            )
            .then((day) => resultHandler(res, dayToJson(day)));
        } else {
          createDay(req, res);
        }
      });
    })
    .catch(errorHandler(res));
};

// DELETE

export const deleteDay = (req: Request<DayRequestParams>, res: Response) => {
  queryUserByToken(req)
    .then((user) => {
      return _queryDays(req, user.name, "require").then((days) => {
        if (days.length) {
          const id = days[0].ref.id;
          return client
            .deleteCollectionItemById(DAYS_COLLECTION.name, id)
            .then(() => resultHandler(res, { success: true }));
        } else {
          return Promise.reject(
            new CustomError("day not found", ERROR_CODES.notFound)
          );
        }
      });
    })
    .catch(errorHandler(res));
};
