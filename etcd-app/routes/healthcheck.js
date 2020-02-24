const express = require('express');
const EtcdService = require('../services/etcd-service.js');

const router = express.Router();

const etcdOptions = { hosts: process.env.ETCD_HOST || 'http://127.0.0.1:2379', retry: true };
const etcdCacheSecret = process.env.ETCD_CACHE_SECRET || 'invalid';

const etcd = new EtcdService(etcdOptions, etcdCacheSecret);

module.exports = (app) => {
  router.get('/healthcheck', async (req, res) => {
    await etcd.etcdPut({ key: 'ETCD_HEALTHCHECK', value: 'HEALTHCHECK_OK' });

    const data = await etcd.etcdGet({ key: 'ETCD_HEALTHCHECK' });

    // returned value should be 'HEALTHCHECK_OK'
    if (!data || data !== 'HEALTHCHECK_OK') {
      return res.status(500).json({ status: 'ERROR', message: 'etcd_connection_failure' });
    }

    await etcd.etcdDelete({ key: 'ETCD_HEALTHCHECK' });

    return res.status(200).json({ status: 'OK', message: 'etcd_connection_established' });
  });

  app.use('/api/v1', router);
};
