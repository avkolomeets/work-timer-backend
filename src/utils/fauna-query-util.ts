import faunadb from "faunadb";
const q = faunadb.query;

export const getAllByIndexName = (indexName, value) => {
  return q.Map(
    q.Paginate(q.Match(q.Index(indexName), value)),
    q.Lambda("X", q.Get(q.Var("X")))
  );
};

export const createCollectionItem = (collectionName, data) => {
  return q.Create(q.Collection(collectionName), { data });
};

export const getCollectionItemById = (collectionName, id) => {
  return q.Get(q.Ref(q.Collection(collectionName), id));
};

export const deleteCollectionItemById = (collectionName, id) => {
  return q.Delete(q.Ref(q.Collection(collectionName), id));
};

export const updateCollectionItemById = (collectionName, id, data) => {
  return q.Update(q.Ref(q.Collection(collectionName), id), { data });
};
