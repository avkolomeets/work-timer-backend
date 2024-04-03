const faunadb = require("faunadb");
const client = new faunadb.Client({
  secret: "394122843454963913", // "fnAFeDSjUgAAyTbtQPst52yFRq9iAaHeFo9f4U5F"
});
module.exports = { client };
