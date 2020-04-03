const express = require('express');
const EtcdService = require('../services/etcd-service.js');

const router = express.Router();

const etcdOptions = { hosts: process.env.ETCD_HOST || 'http://127.0.0.1:2379', retry: true };
const etcdCacheSecret = process.env.ETCD_CACHE_SECRET || 'invalid';

const etcd = new EtcdService(etcdOptions, etcdCacheSecret);

module.exports = (app) => {
  router.get('/users/:name', async (req, res) => {
    const name = req.params.name && req.params.name.toString().trim();
    console.info(`ROUTE /api/v1/users/${name}`);

    if (!name) {
      return res.status(400).json({ status: 'ERROR', message: 'invalid_params' });
    }

    const user = await etcd.etcdGet({ key: name });
    if (user) {
      console.info('serving from CACHE :: user', user);
      return res.status(200).json({ status: 'OK', data: { id: user.id, name: user.name } });
    }

    const random = Math.round(Math.random() * (+100000 - +1000) + +1000);
    const userRegister = { id: random, name };

    await etcd.etcdPut({ key: name, value: userRegister });

    return res.status(200).json({ status: 'OK', data: userRegister });
  });

  router.get('/users', async (req, res) => {
    const users = await etcd.etcdGetAll();

    return res.status(200).json({ status: 'OK', data: users });
  });

  app.use('/api/v1', router);
};
