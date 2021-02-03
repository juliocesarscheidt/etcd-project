const crypto = require('crypto');

const makeEtcdKey = ({ key, etcdCacheSecret }) => {
  const hash = crypto
    .createHmac('sha256', etcdCacheSecret)
    .update(JSON.stringify(key))
    .digest('hex');

  const etcdKey = `/${key}/${hash}`;
  console.info('etcdKey =>', etcdKey);

  return etcdKey;
};

module.exports = {
  makeEtcdKey,
};
