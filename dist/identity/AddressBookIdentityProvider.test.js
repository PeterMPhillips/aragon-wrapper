"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _ava = _interopRequireDefault(require("ava"));

var _cache = _interopRequireDefault(require("../cache"));

var _rxjs = require("rxjs");

var _index = require("./index");

let apps, cache;

_ava.default.before(async t => {
  apps = (0, _rxjs.of)([{
    appId: '0x32ec8cc9f3136797e0ae30e7bf3740905b0417b81ff6d4a74f6100f9037425de',
    proxyAddress: '0x0'
  }, {
    appId: '0x123',
    proxyAddress: '0x1'
  }, {
    appId: '0x32ec8cc9f3136797e0ae30e7bf3740905b0417b81ff6d4a74f6100f9037425de',
    proxyAddress: '0x11'
  }]);
  cache = new _cache.default('stubbedAddressBook');
  await cache.init();
  cache.set('0x0.state', {
    entries: [{
      addr: '0x3a',
      data: {
        name: 'testEntity'
      }
    }, {
      addr: '0x33',
      data: {
        name: 'testDude'
      }
    }]
  });
  cache.set('0x11.state', {
    entries: [{
      addr: '0x3a',
      data: {
        name: 'testEntity2'
      }
    }]
  });
});

_ava.default.beforeEach(async t => {
  t.context.addressBookIdentityProvider = new _index.AddressBookIdentityProvider(apps, cache);
  await t.context.addressBookIdentityProvider.init();
});

(0, _ava.default)('should resolve identity from first address book in app array', async t => {
  const provider = t.context.addressBookIdentityProvider;
  const identityMetadata = await provider.resolve('0x3a');
  t.is(identityMetadata.name, 'testEntity');
});
(0, _ava.default)('should resolve to null for non-existent identity', async t => {
  const provider = t.context.addressBookIdentityProvider;
  const identityMetadata = await provider.resolve('0x9');
  t.is(identityMetadata, null);
});
(0, _ava.default)('should throw error on any modify attempt', async t => {
  const provider = t.context.addressBookIdentityProvider;
  await t.throwsAsync(() => provider.modify('0x9', {
    name: 'newEntity'
  }));
});
(0, _ava.default)('getAll should return a combined Object containing all entries', async t => {
  const provider = t.context.addressBookIdentityProvider;
  const allIdentities = await provider.getAll();
  t.deepEqual(allIdentities, {
    '0x3a': {
      name: 'testEntity'
    },
    '0x33': {
      name: 'testDude'
    }
  });
});
(0, _ava.default)('search should return an array of results of freely matching identities', async t => {
  const provider = t.context.addressBookIdentityProvider;
  let result = await provider.search('0x3a');
  t.deepEqual(result, [{
    name: 'testEntity',
    address: '0x3a'
  }]);
  result = await provider.search('test');
  t.deepEqual(result, [{
    name: 'testEntity',
    address: '0x3a'
  }, {
    name: 'testDude',
    address: '0x33'
  }]);
  result = await provider.search('testd');
  t.deepEqual(result, [{
    name: 'testDude',
    address: '0x33'
  }]);
});
//# sourceMappingURL=AddressBookIdentityProvider.test.js.map