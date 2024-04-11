import faunadb from "faunadb";
import {
  createCollectionItem,
  deleteCollectionItemById,
  getAllByIndexName,
  updateCollectionItemById,
} from "./fauna-query-util";
import { CollectionItem } from "models/intefaces-collections";
export const fclient = new faunadb.Client({
  secret: process.env.FAUNA_KEY as string,
});

export const client = {
  createCollectionItem: <T = any>(
    collectionName: string,
    data: T
  ): Promise<CollectionItem<T>> => {
    return fclient.query(createCollectionItem(collectionName, data));
  },

  getAllByIndexName: <T = any>(
    indexName: string,
    matchParams: string | (string | number)[]
  ): Promise<T[]> => {
    return fclient
      .query(getAllByIndexName(indexName, matchParams as any))
      .then((r: any) => r.data || []);
  },

  updateCollectionItemById: <T = any>(
    collectionName: string,
    id: string,
    data: T
  ): Promise<CollectionItem<T>> => {
    return fclient.query(updateCollectionItemById(collectionName, id, data));
  },

  deleteCollectionItemById: (collectionName: string, id: string) => {
    return fclient
      .query(deleteCollectionItemById(collectionName, id))
      .then(() => {});
  },
};
