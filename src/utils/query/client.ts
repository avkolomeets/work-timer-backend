import faunadb from "faunadb";
import { CollectionItem } from "models/intefaces-collections";
import { removeMissingProperties } from "../json-util";
import {
  createCollectionItem,
  deleteCollectionItemById,
  getAllByIndexName,
  getCollectionItemById,
  updateCollectionItemById,
} from "./fauna-query-util";
export const fclient = new faunadb.Client({
  secret: process.env.FAUNA_KEY as string,
});

export const client = {
  createCollectionItem: <T = any>(
    collectionName: string,
    data: Partial<T>
  ): Promise<CollectionItem<T>> => {
    return fclient.query(
      createCollectionItem(collectionName, removeMissingProperties(data))
    );
  },

  getAllByIndexName: <T = any>(
    indexName: string,
    matchParams: string | (string | number)[]
  ): Promise<CollectionItem<T>[]> => {
    return fclient
      .query(getAllByIndexName(indexName, matchParams as any))
      .then((r: any) => r.data || []);
  },

  getCollectionItemById: <T = any>(
    collectionName: string,
    id: string
  ): Promise<CollectionItem<T>> => {
    return fclient.query(getCollectionItemById(collectionName, id));
  },

  updateCollectionItemById: <T = any>(
    collectionName: string,
    id: string,
    data: Partial<T>
  ): Promise<CollectionItem<T>> => {
    return fclient.query(
      updateCollectionItemById(
        collectionName,
        id,
        removeMissingProperties(data)
      )
    );
  },

  deleteCollectionItemById: (collectionName: string, id: string) => {
    return fclient
      .query(deleteCollectionItemById(collectionName, id))
      .then(() => {});
  },
};
