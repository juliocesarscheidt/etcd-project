const healthcheckController = require('../controllers/healthcheckController');
const logMiddleware = require('../middlewares/logMiddleware');

module.exports = (router) => {
  router.get('/healthcheck', [logMiddleware], healthcheckController.health);
};
