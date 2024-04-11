import faunadb from "faunadb";
const q = faunadb.query;

export const getAllByIndexName = (indexName: string, value: string) => {
  return q.Map(
    q.Paginate(q.Match(q.Index(indexName), value)),
    q.Lambda("X", q.Get(q.Var("X")))
  );
};

export const createCollectionItem = (collectionName: string, data: any) => {
  return q.Create(q.Collection(collectionName), { data });
};

export const getCollectionItemById = (collectionName: string, id: string) => {
  return q.Get(q.Ref(q.Collection(collectionName), id));
};

export const deleteCollectionItemById = (
  collectionName: string,
  id: string
) => {
  return q.Delete(q.Ref(q.Collection(collectionName), id));
};

export const updateCollectionItemById = (
  collectionName: string,
  id: string,
  data: any
) => {
  return q.Update(q.Ref(q.Collection(collectionName), id), { data });
};
