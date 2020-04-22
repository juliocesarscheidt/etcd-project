const express = require('express');
const EtcdService = require('./services/etcd-service.js');

const port = process.env.API_PORT || 8200;
const app = express();

const etcdOptions = { hosts: process.env.ETCD_HOST || 'http://127.0.0.1:2379', retry: true };
const etcdCacheSecret = process.env.ETCD_CACHE_SECRET || 'invalid';

const etcd = new EtcdService(etcdOptions, etcdCacheSecret);

require('./routes/user.js')(app, etcd);
require('./routes/healthcheck.js')(app, etcd);

app.listen(port, () => {
  console.info(`Server listening on port ${port}`);
});
