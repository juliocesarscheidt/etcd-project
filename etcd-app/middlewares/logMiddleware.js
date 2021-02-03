module.exports = (req, res, next) => {
  console.info(`ROUTE ${req.method} ${req.url}`);
  next();
}
