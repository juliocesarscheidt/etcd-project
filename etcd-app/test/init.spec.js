const { jsonParser, jsonStringify, parseObjectValuesToArray } = require('../utils/jsonUtils');

const EtcdService = require('../services/etcdService.js');
jest.mock('../services/etcdService.js');

it('should parse the string correctly', () => {
  expect(jsonParser('{"name": "USER_01"}')).toStrictEqual({ name: 'USER_01' });
  expect(jsonParser('{"name": "USER_01"}').name).toStrictEqual('USER_01');
});

it('should stringify the object correctly', () => {
  expect(jsonStringify({ name: 'USER_01' })).toStrictEqual('{"name":"USER_01"}');
});

it('should return parse the elements of a given object and turn into an array', () => {
  const obj = {
    key: '{"name":"USER_01"}',
  };
  const objParsed = parseObjectValuesToArray(obj);

  expect(objParsed).toStrictEqual([{ name: 'USER_01' }]);
  expect(objParsed[0]).toStrictEqual({ name: 'USER_01' });
  expect(objParsed[0].name).toStrictEqual('USER_01');
});

beforeEach(() => {
  // Clear all instances and calls to constructor and all methods:
  EtcdService.mockClear();
});

it('should check etcd service hasn\'t been called in the begin', async () => {
  expect(EtcdService).not.toHaveBeenCalled();

  const etcd = new EtcdService();
  expect(EtcdService).toHaveBeenCalledTimes(1);
});

it('should check etcd service has been called', async () => {
  const etcd = new EtcdService();
  expect(EtcdService).toHaveBeenCalledTimes(1);
});

it('should test the etcd put method', async () => {
  const etcd = new EtcdService();

  const data = { key: 'USER_01', value: { id: 1, name: 'USER_01' } };
  await etcd.etcdPut(data);

  const mockEtcdServiceInstance = EtcdService.mock.instances[0];
  const mockEtcdPut = await mockEtcdServiceInstance.etcdPut;

  expect(mockEtcdPut.mock.calls[0][0]).toEqual(data);
});

it('should test the etcd get method', async () => {
  const etcd = new EtcdService();

  const data = { key: 'USER_01' };
  await etcd.etcdGet(data);

  const mockEtcdServiceInstance = EtcdService.mock.instances[0];
  const mockEtcdPut = await mockEtcdServiceInstance.etcdGet;

  expect(mockEtcdPut.mock.calls[0][0]).toEqual(data);
});
