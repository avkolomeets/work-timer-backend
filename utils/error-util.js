const _handleError = (res, error) => {
  res.status(500).send(error.message);
};

const errorHandler = (res) => (error) => _handleError(res, error);

module.exports = {
  errorHandler,
};
