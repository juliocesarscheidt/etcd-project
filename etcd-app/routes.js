const express = require('express');

const router = express.Router();
const { etcdPut, etcdGet, etcdGetAll } = require('./etcd-service.js');

module.exports = (app) => {
  router.get('/users/:name', async (req, res) => {
    const name = req.params.name && req.params.name.toString().trim();
    if (!name) {
      return res.status(400).json({ status: 'ERROR', message: 'bad_request' });
    }

    const user = await etcdGet({ key: name });
    if (user) {
      console.info('returning from CACHE :: user', user);
      return res.status(202).json({ status: 'OK', data: { id: user.id, name: user.name } });
    }

    const random = Math.round(Math.random() * (+100000 - +1000) + +1000);
    const userRegister = { id: random, name };

    await etcdPut({ key: name, value: userRegister });

    return res.status(202).json({ status: 'OK', data: userRegister });
  });

  router.get('/users', async (req, res) => {
    const users = await etcdGetAll();

    return res.status(202).json({ status: 'OK', data: users });
  });

  app.use('/api/v1', router);
};
