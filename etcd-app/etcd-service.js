const { Etcd3 } = require('etcd3');
const etcdOptions = { hosts: process.env.ETCD_HOST || 'http://127.0.0.1:2379', retry: true };
const etcdClient = new Etcd3(etcdOptions);

const jsonParser = json => JSON.parse(json);

const etcdPut = async ({ key, value }) => {
  const res = await etcdClient.put(key).value(value);

  return res;
}

const etcdGet = async ({ key }) => {
  const res = await etcdClient.get(key).string();

  return jsonParser(res);
}

const etcdGetAll = async () => {
  const res = await etcdClient.getAll().strings();
  Object.keys(res).map(key => res[key] = jsonParser(res[key]));

  return res;
}

const etcdGetByPrefix = async ({ prefix }) => {
  const res = await etcdClient.getAll().prefix(prefix).strings();

  return jsonParser(res);
}

const etcdDeleteAll = async () => {
  const res = await etcdClient.delete().all();

  return res;
}

module.exports = {
  etcdPut,
  etcdGet,
  etcdGetAll,
  etcdGetByPrefix,
  etcdDeleteAll,
}
