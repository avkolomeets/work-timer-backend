const { client } = require("./client");
const { errorHandler } = require("../utils/error-util");
const {
  getAllByIndexName,
  createCollectionItem,
  deleteCollectionItemById,
  updateCollectionItemById,
} = require("../utils/fauna-query-util");

const _deptToJson = (dept) => {
  return {
    ...dept.data,
  };
};

const _deptDataFromBody = (req) => {
  const { user, dept } = req.body;
  return { user, dept: +dept || 0 };
};

const _queryDepts = (params) => {
  if (!params.user) {
    return Promise.reject(new Error("user not specified"));
  }

  return client
    .query(getAllByIndexName("depts_by_user", params.user))
    .then((r) => r.data || []);
};

const addDept = (req, res) => {
  _queryDepts(req.query).then((depts) => {
    if (depts.length) {
      editDept(req, res);
    } else {
      const data = _deptDataFromBody(req);
      data.user = data.user || req.query.user;
      client
        .query(createCollectionItem("depts", data))
        .then((dept) => res.status(200).json(_deptToJson(dept)))
        .catch(errorHandler(res));
    }
  });
};

const getDept = (req, res) => {
  _queryDepts(req.query)
    .then((depts) => res.status(200).json(depts.map(_deptToJson)[0]))
    .catch(errorHandler(res));
};

const deleteDept = (req, res) => {
  _queryDepts(req.query)
    .then((depts) => {
      if (depts.length) {
        const id = depts[0].ref.id;
        client
          .query(deleteCollectionItemById("depts", id))
          .then((dept) => res.status(200).json(id))
          .catch(errorHandler(res));
      } else {
        throw new Error("item not found");
      }
    })
    .catch(errorHandler(res));
};

const editDept = (req, res) => {
  _queryDepts(req.query).then((depts) => {
    if (depts.length) {
      const data = _deptDataFromBody(req);
      client
        .query(updateCollectionItemById("depts", depts[0].ref.id, data))
        .then((dept) => res.json(_deptToJson(dept)))
        .catch(errorHandler(res));
    } else {
      addDept(req, res);
    }
  });
};

module.exports = {
  addDept,
  getDept,
  deleteDept,
  editDept,
};
