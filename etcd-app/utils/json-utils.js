const jsonParser = (json) => JSON.parse(json);
const jsonStringify = (json) => JSON.stringify(json);
const parseObjectValuesToArray = (obj) => Object.keys(obj).map((key) => jsonParser(obj[key]));

module.exports = {
  jsonParser,
  jsonStringify,
  parseObjectValuesToArray,
};
