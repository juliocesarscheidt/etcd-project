const crypto = require('crypto');
const { Etcd3 } = require('etcd3');
const { jsonParser, jsonStringify, parseObjectValuesToArray } = require('../utils/json-utils');

const makeEtcdKey = ({ key, etcdCacheSecret }) => {
  const hash = crypto
    .createHmac('sha256', etcdCacheSecret)
    .update(JSON.stringify(key))
    .digest('hex');

  const etcdKey = `/${key}/${hash}`;
  console.info('etcdKey =>', etcdKey);

  return etcdKey;
};

class EtcdService {
  constructor(etcdOptions, etcdCacheSecret) {
    this.etcdCacheSecret = etcdCacheSecret;
    this.etcdOptions = etcdOptions;

    this.init();
  }

  async init() {
    // initialize etcd client
    try {
      this.etcdClient = await this.getETCDConnection();
    } catch (_) {
      console.error('[ERROR] Could not connect to ETCD');
    }
  }

  async getETCDConnection() {
    let etcdClient = null;

    return new Promise((resolve, reject) => {
      if (this.etcdClient !== undefined && this.etcdClient !== null) {
        resolve(this.etcdClient);
      }

      try {
        etcdClient = new Etcd3(this.etcdOptions);
        resolve(etcdClient);
      } catch (exception) {
        reject(exception);
      }
    });
  }

  async etcdPut({ key, value }) {
    if (this.etcdClient === undefined || this.etcdClient === null) {
      this.etcdClient = await this.getETCDConnection();
    }

    try {
      const etcdKey = makeEtcdKey({ key, etcdCacheSecret: this.etcdCacheSecret });

      const res = await this.etcdClient.put(etcdKey).value(jsonStringify(value));
      console.info('member_id', res.header.member_id);

      return res;
    } catch (exception) {
      console.error('[ERROR] Error when trying to call ETCD', exception);
      throw exception;
    }
  }

  async etcdGet({ key }) {
    try {
      const etcdKey = makeEtcdKey({ key, etcdCacheSecret: this.etcdCacheSecret });

      const res = await this.etcdClient.get(etcdKey).string();

      return jsonParser(res);
    } catch (exception) {
      console.error('[ERROR] Error when trying to call ETCD', exception);
      throw exception;
    }
  }

  async etcdGetAll() {
    try {
      const res = await this.etcdClient.getAll().strings();

      return parseObjectValuesToArray(res);
    } catch (exception) {
      console.error('[ERROR] Error when trying to call ETCD', exception);
      throw exception;
    }
  }

  async etcdGetAllByPrefix({ prefix }) {
    try {
      const res = await this.etcdClient.getAll().prefix(prefix).strings();

      return parseObjectValuesToArray(res);
    } catch (exception) {
      console.error('[ERROR] Error when trying to call ETCD', exception);
      throw exception;
    }
  }

  async etcdDelete({ key }) {
    try {
      const etcdKey = makeEtcdKey({ key, etcdCacheSecret: this.etcdCacheSecret });
      const res = await this.etcdClient.delete().key(etcdKey);

      return res;
    } catch (exception) {
      console.error('[ERROR] Error when trying to call ETCD', exception);
      throw exception;
    }
  }

  async etcdDeleteAll() {
    try {
      const res = await this.etcdClient.delete().all();

      return res;
    } catch (exception) {
      console.error('[ERROR] Error when trying to call ETCD', exception);
      throw exception;
    }
  }
}

module.exports = EtcdService;
