const faunadb = require("faunadb");
const client = new faunadb.Client({
  secret: process.env.FAUNA_KEY,
});
module.exports = { client };
