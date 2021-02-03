const EtcdClient = require('../connection/etcdClient');
const { jsonParser, jsonStringify, parseObjectValuesToArray } = require('../utils/jsonUtils');
const { makeEtcdKey } = require('../utils/etcdUtils');

const etcdCacheSecret = process.env.ETCD_CACHE_SECRET || 'invalid';

class EtcdService {
  constructor() {
    this.init();
  }

  async init() {
    // initialize etcd client
    try {
      const etcdClient = new EtcdClient();
      this.etcdClient = await etcdClient.getETCDConnection();

    } catch (_) {
      console.error('[ERROR] Could not connect to ETCD');
    }
  }

  async etcdGet({ key }) {
    try {
      const etcdKey = makeEtcdKey({ key, etcdCacheSecret });

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

  async etcdPut({ key, value }) {
    try {
      const etcdKey = makeEtcdKey({ key, etcdCacheSecret });

      const res = await this.etcdClient.put(etcdKey).value(jsonStringify(value));
      console.info('member_id', res.header.member_id);

      return res;

    } catch (exception) {
      console.error('[ERROR] Error when trying to call ETCD', exception);
      throw exception;
    }
  }

  async etcdDelete({ key }) {
    try {
      const etcdKey = makeEtcdKey({ key, etcdCacheSecret });
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
