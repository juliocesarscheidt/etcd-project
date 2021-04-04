const userController = require('../controllers/userController');
const logMiddleware = require('../middlewares/logMiddleware');

module.exports = (router) => {
  router.post('/users', [logMiddleware], userController.create);
  router.get('/users', [logMiddleware], userController.find);
  router.delete('/users/:name', [logMiddleware], userController.deleteOne);
  router.get('/users/:name', [logMiddleware], userController.findOne);
};
