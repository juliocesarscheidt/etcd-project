const crypto = require('crypto');
const { Etcd3 } = require('etcd3');

const etcdOptions = { hosts: process.env.ETCD_HOST || 'http://127.0.0.1:2379', retry: true };
const etcdClient = new Etcd3(etcdOptions);

const jsonParser = (json) => JSON.parse(json);
const jsonStringify = (json) => JSON.stringify(json);
const parseObjectValues = (obj) => Object.keys(obj).map((key) => jsonParser(obj[key]));

const secret = process.env.ETCD_CACHE_SECRET || 'invalid';

const etcdPut = async ({ key, value }) => {
  const hash = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(key))
    .digest('hex');

  const etcdKey = `/${key}/${hash}`;
  console.info('etcdKey', etcdKey);

  const res = await etcdClient.put(etcdKey).value(jsonStringify(value));

  return res;
};

const etcdGet = async ({ key }) => {
  const hash = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(key))
    .digest('hex');

  const etcdKey = `/${key}/${hash}`;
  console.info('etcdKey', etcdKey);

  const res = await etcdClient.get(etcdKey).string();

  return jsonParser(res);
};

const etcdGetAll = async () => {
  const res = await etcdClient.getAll().strings();

  return parseObjectValues(res);
};

const etcdGetAllByPrefix = async ({ prefix }) => {
  const res = await etcdClient.getAll().prefix(prefix).strings();

  return parseObjectValues(res);
};

const etcdDeleteAll = async () => {
  const res = await etcdClient.delete().all();

  return res;
};

module.exports = {
  etcdPut,
  etcdGet,
  etcdGetAll,
  etcdGetAllByPrefix,
  etcdDeleteAll,
};
