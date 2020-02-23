const crypto = require('crypto');
const { Etcd3 } = require('etcd3');
const { jsonParser, jsonStringify, parseObjectValuesToArray } = require('../utils/json-utils');

class EtcdService {
  constructor(etcdOptions, etcdCacheSecret) {
    this.etcdCacheSecret = etcdCacheSecret;
    this.etcdClient = new Etcd3(etcdOptions);
  }

  async etcdPut({ key, value }) {
    const hash = crypto
      .createHmac('sha256', this.etcdCacheSecret)
      .update(JSON.stringify(key))
      .digest('hex');

    const etcdKey = `/${key}/${hash}`;
    console.info('etcdKey', etcdKey);

    const res = await this.etcdClient.put(etcdKey).value(jsonStringify(value));
    console.info('member_id', res.header.member_id);

    return res;
  }

  async etcdGet({ key }) {
    const hash = crypto
      .createHmac('sha256', this.etcdCacheSecret)
      .update(JSON.stringify(key))
      .digest('hex');

    const etcdKey = `/${key}/${hash}`;
    console.info('etcdKey', etcdKey);

    const res = await this.etcdClient.get(etcdKey).string();

    return jsonParser(res);
  }

  async etcdGetAll() {
    const res = await this.etcdClient.getAll().strings();

    return parseObjectValuesToArray(res);
  }

  async etcdGetAllByPrefix({ prefix }) {
    const res = await this.etcdClient.getAll().prefix(prefix).strings();

    return parseObjectValuesToArray(res);
  }

  async etcdDeleteAll() {
    const res = await this.etcdClient.delete().all();

    return res;
  }
}

module.exports = EtcdService;
