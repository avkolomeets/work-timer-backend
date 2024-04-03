const faunadb = require("faunadb");
const q = faunadb.query;

const getAllByIndexName = (indexName, value) => {
  return q.Map(
    q.Paginate(q.Match(q.Index(indexName), value)),
    q.Lambda("X", q.Get(q.Var("X")))
  );
};

const createCollectionItem = (collectionName, data) => {
  return q.Create(q.Collection(collectionName), { data });
};

const getCollectionItemById = (collectionName, id) => {
  return q.Get(q.Ref(q.Collection(collectionName), id));
};

const deleteCollectionItemById = (collectionName, id) => {
  return q.Delete(q.Ref(q.Collection(collectionName), id));
};

const updateCollectionItemById = (collectionName, id, data) => {
  return q.Update(q.Ref(q.Collection(collectionName), id), { data });
};

module.exports = {
  getAllByIndexName,
  createCollectionItem,
  getCollectionItemById,
  deleteCollectionItemById,
  updateCollectionItemById,
};
