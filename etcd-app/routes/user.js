const express = require('express');
const codes = require('../utils/http-utils');

const router = express.Router();

module.exports = (app, etcd) => {
  router.get('/users/:name', async (req, res) => {
    const name = req.params.name && req.params.name.toString().trim();
    console.info(`ROUTE /api/v1/users/${name}`);

    if (!name) {
      return res.status(codes.HTTP_BAD_REQUEST).json({ status: 'ERROR', message: 'invalid_params' });
    }

    try {
      const user = await etcd.etcdGet({ key: name });
      if (user) {
        console.info('serving from CACHE :: key', user);
        return res.status(codes.HTTP_OK).json({ status: 'OK', data: { id: user.id, name: user.name } });
      }
    } catch (_) {
      return res.status(codes.HTTP_INTERNAL_SERVER_ERROR).json({ status: 'ERROR', message: 'internal_server_error' });
    }

    const random = Math.round(Math.random() * (+100000 - +1000) + +1000);
    const userRegister = { id: random, name };

    try {
      await etcd.etcdPut({ key: name, value: userRegister });

      return res.status(codes.HTTP_OK).json({ status: 'OK', data: userRegister });
    } catch (_) {
      return res.status(codes.HTTP_INTERNAL_SERVER_ERROR).json({ status: 'ERROR', message: 'internal_server_error' });
    }
  });

  router.get('/users', async (req, res) => {
    console.info('ROUTE /api/v1/users');

    try {
      const users = await etcd.etcdGetAll();

      return res.status(codes.HTTP_OK).json({ status: 'OK', data: users });
    } catch (_) {
      return res.status(codes.HTTP_INTERNAL_SERVER_ERROR).json({ status: 'ERROR', message: 'internal_server_error' });
    }
  });

  app.use('/api/v1', router);
};
