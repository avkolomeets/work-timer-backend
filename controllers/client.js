const faunadb = require("faunadb");
const client = new faunadb.Client({
  secret: "fnAFeD3wryAAyeR_xDkvXxUKiH7cYRjs5facOPnx",
});
module.exports = { client };
