const { Etcd3 } = require('etcd3');

class EtcdClient {
  constructor() {
    this.etcdClient = null;

    this.etcdOptions = { hosts: process.env.ETCD_HOST || 'http://127.0.0.1:2379', retry: true };
    this.etcdCacheSecret = process.env.ETCD_CACHE_SECRET || 'invalid';
  }

  async getETCDConnection() {
    return new Promise((resolve, reject) => {
      if (this.etcdClient !== undefined && this.etcdClient !== null) {
        return resolve(this.etcdClient);
      }

      try {
        this.etcdClient = new Etcd3(this.etcdOptions);
        return resolve(this.etcdClient);

      } catch (exception) {
        return reject(exception);
      }
    });
  }
}

module.exports = EtcdClient;
