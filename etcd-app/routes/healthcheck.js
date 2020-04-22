const express = require('express');
const codes = require('../utils/http-utils');

const router = express.Router();

module.exports = (app, etcd) => {
  router.get('/healthcheck', async (req, res) => {
    console.info('ROUTE /api/v1/healthcheck');

    let data = {};

    try {
      await etcd.etcdPut({ key: 'ETCD_HEALTHCHECK', value: 'HEALTHCHECK_OK' });
      data = await etcd.etcdGet({ key: 'ETCD_HEALTHCHECK' });
    } catch (_) {
      return res.status(codes.HTTP_INTERNAL_SERVER_ERROR).json({ status: 'ERROR', message: 'etcd_connection_failure' });
    }

    // returned value should be 'HEALTHCHECK_OK'
    if (!data || data !== 'HEALTHCHECK_OK') {
      return res.status(codes.HTTP_INTERNAL_SERVER_ERROR).json({ status: 'ERROR', message: 'etcd_connection_failure' });
    }

    try {
      await etcd.etcdDelete({ key: 'ETCD_HEALTHCHECK' });
      return res.status(codes.HTTP_OK).json({ status: 'OK', message: 'etcd_connection_established' });
    } catch (_) {
      return res.status(codes.HTTP_INTERNAL_SERVER_ERROR).json({ status: 'ERROR', message: 'etcd_connection_failure' });
    }
  });

  app.use('/api/v1', router);
};
