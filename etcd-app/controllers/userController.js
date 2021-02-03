const codes = require('../utils/httpUtils');
const EtcdService = require('../services/etcdService.js');

const etcd = new EtcdService();

module.exports = {
  async find(req, res) {
    try {
      const users = await etcd.etcdGetAll();

      return res
        .status(codes.HTTP_OK)
        .json({ status: 'OK', data: users });

    } catch (_) {
      return res
        .status(codes.HTTP_INTERNAL_SERVER_ERROR)
        .json({ status: 'ERROR', message: 'internal_server_error' });
    }
  },

  async findOne(req, res) {
    const name = req.params.name && req.params.name.toString().trim();
    if (!name) {
      return res
        .status(codes.HTTP_BAD_REQUEST)
        .json({ status: 'ERROR', message: 'invalid_params' });
    }

    try {
      const user = await etcd.etcdGet({ key: name });
      if (!user) {
        return res
          .status(codes.HTTP_NOT_FOUND)
          .json({ status: 'ERROR', message: 'not_found' });
      }

      console.info('user', user);
      return res
        .status(codes.HTTP_OK)
        .json({ status: 'OK', data: { id: user.id, name: user.name } });

    } catch (_) {
      return res
        .status(codes.HTTP_INTERNAL_SERVER_ERROR)
        .json({ status: 'ERROR', message: 'internal_server_error' });
    }
  },

  async create(req, res) {
    const name = req.body.name && req.body.name.toString().trim();
    if (!name) {
      return res
        .status(codes.HTTP_BAD_REQUEST)
        .json({ status: 'ERROR', message: 'invalid_params' });
    }

    const random = Math.round(Math.random() * (+100000 - +1000) + +1000);
    const userRegister = { id: random, name, created_at: new Date() };

    try {
      await etcd.etcdPut({ key: name, value: userRegister });

      return res
        .status(codes.HTTP_CREATED)
        .json({ status: 'OK', data: userRegister });

    } catch (_) {
      return res
        .status(codes.HTTP_INTERNAL_SERVER_ERROR)
        .json({ status: 'ERROR', message: 'internal_server_error' });
    }
  },

  async deleteOne(req, res) {
    const name = req.params.name && req.params.name.toString().trim();
    if (!name) {
      return res
        .status(codes.HTTP_BAD_REQUEST)
        .json({ status: 'ERROR', message: 'invalid_params' });
    }

    try {
      await etcd.etcdDelete({ key: name });

      return res
        .status(codes.HTTP_NO_CONTENT)
        .json({ status: 'OK' });

    } catch (_) {
      return res
        .status(codes.HTTP_INTERNAL_SERVER_ERROR)
        .json({ status: 'ERROR', message: 'internal_server_error' });
    }
  },
}
