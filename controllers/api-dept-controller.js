const { client } = require("./client");
const { errorHandler } = require("../utils/error-util");
const {
  getAllByIndexName,
  createCollectionItem,
  deleteCollectionItemById,
  updateCollectionItemById,
} = require("../utils/fauna-query-util");
const { removeUndefinedProperties } = require("../utils/json-util");
const { toNumberOrUndefined } = require("../utils/number-util");

const _deptToJson = (dept) => {
  return {
    ...dept.data,
  };
};

const _deptDataFromReq = (req) => {
  console.log("Query: ");
  console.log(req.query);
  console.log("Body: ");
  console.log(req.body);
  const _toParams = (params) => {
    const { user, dept } = params;
    return removeUndefinedProperties({
      user,
      dept: toNumberOrUndefined(dept),
    });
  };
  return { ..._toParams(req.query), ..._toParams(req.body) };
};

const _queryDepts = (params) => {
  if (!params.user) {
    return Promise.reject(new Error("user not specified"));
  }

  return client
    .query(getAllByIndexName("depts_by_user", params.user))
    .then((r) => r.data || []);
};

// CREATE

const addDept = (req, res) => {
  _queryDepts(req.query).then((depts) => {
    if (depts.length) {
      editDept(req, res);
    } else {
      const data = _deptDataFromReq(req);
      client
        .query(createCollectionItem("depts", data))
        .then((dept) => res.status(200).json(_deptToJson(dept)))
        .catch(errorHandler(res));
    }
  });
};

// READ

const getDept = (req, res) => {
  _queryDepts(req.query)
    .then((depts) => res.status(200).json(depts.map(_deptToJson)[0] || {}))
    .catch(errorHandler(res));
};

// UPDATE

const editDept = (req, res) => {
  _queryDepts(req.query).then((depts) => {
    if (depts.length) {
      const data = _deptDataFromReq(req);
      client
        .query(updateCollectionItemById("depts", depts[0].ref.id, data))
        .then((dept) => res.json(_deptToJson(dept)))
        .catch(errorHandler(res));
    } else {
      addDept(req, res);
    }
  });
};

// DELETE

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

module.exports = {
  addDept,
  getDept,
  deleteDept,
  editDept,
};
