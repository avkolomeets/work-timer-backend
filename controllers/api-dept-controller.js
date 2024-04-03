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
  return { user, dept };
};

const _queryDepts = (params) => {
  return client.query(getAllByIndexName("depts_by_user", params.user));
};

const addDept = (req, res) => {
  _queryDepts(req.query).then((depts) => {
    if (depts.length) {
      editDept(req, res);
    } else {
      const data = _deptDataFromBody(req);
      client
        .query(createCollectionItem("depts", data))
        .then((dept) => res.status(200).json(_deptToJson(dept)))
        .catch(errorHandler(res));
    }
  });
};

const getDept = (req, res) => {
  _queryDepts(req.query)
    .then((depts) => res.status(200).json(depts.data.map(_deptToJson)[0]))
    .catch(errorHandler(res));
};

const deleteDept = (req, res) => {
  _queryDepts(req.query)
    .then((depts) => {
      if (depts.length) {
        const id = depts[0].id;
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
        .query(updateCollectionItemById("depts", depts[0].id, data))
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
