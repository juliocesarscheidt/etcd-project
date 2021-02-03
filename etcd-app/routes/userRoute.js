const userController = require('../controllers/userController');
const logMiddleware = require('../middlewares/logMiddleware');

module.exports = (router) => {
  router.get('/users', [logMiddleware], userController.find);

  router.get('/users/:name', [logMiddleware], userController.findOne);

  router.post('/users', [logMiddleware], userController.create);

  router.delete('/users/:name', [logMiddleware], userController.deleteOne);
};
