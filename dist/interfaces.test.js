"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _ava = _interopRequireDefault(require("ava"));

var _sinon = _interopRequireDefault(require("sinon"));

var _interfaces = require("./interfaces");

var _apps = require("./utils/apps");

_ava.default.afterEach.always(() => {
  _sinon.default.restore();
});

(0, _ava.default)('interfaces: getAbi', async t => {
  t.plan(12); // arrange

  const availableABIs = ['aragon/ACL', 'aragon/AppProxy', 'aragon/ERCProxy', 'aragon/Forwarder', 'aragon/ForwarderFee', 'aragon/Kernel', 'aragon/EVM Script Registry', 'apm/APM Registry', 'apm/Repo', 'apm/ENS Subdomain Registrar', 'standard/ERC20']; // assert

  availableABIs.forEach(abiName => {
    const result = (0, _interfaces.getAbi)(abiName);
    t.true(Array.isArray(result), abiName);
  });
  const emptyResult = (0, _interfaces.getAbi)();
  t.is(emptyResult, null);
});
(0, _ava.default)('interfaces: getArtifact', async t => {
  t.plan(13); // arrange

  const availableArtifacts = ['aragon/ACL', 'aragon/Kernel', 'aragon/EVM Script Registry', 'apm/APM Registry', 'apm/Repo', 'apm/ENS Subdomain Registrar']; // assert

  availableArtifacts.forEach(artifactName => {
    const result = (0, _interfaces.getArtifact)(artifactName);
    t.true('functions' in result);
    t.true('roles' in result);
  });
  const emptyResult = (0, _interfaces.getArtifact)();
  t.is(emptyResult, null);
});
(0, _ava.default)('interfaces: getAppInfo', async t => {
  t.plan(29); // arrange

  const availableMappings = [['aragon', [(0, _apps.apmAppId)('acl'), (0, _apps.apmAppId)('evmreg'), (0, _apps.apmAppId)('kernel')]], ['apm', [(0, _apps.apmAppId)('apm-registry'), (0, _apps.apmAppId)('apm-repo'), (0, _apps.apmAppId)('apm-enssub'), (0, _apps.apmAppId)('apm-registry.open'), (0, _apps.apmAppId)('apm-repo.open'), (0, _apps.apmAppId)('apm-enssub.open')]]]; // assert

  availableMappings.forEach(([namespace, appIds]) => {
    appIds.forEach(appId => {
      const result = (0, _interfaces.getAppInfo)(appId, namespace);
      t.true(Array.isArray(result.abi));
      t.true('functions' in result);
      t.true('roles' in result);
    });
  });
  const emptyDueToUnknownMapping = (0, _interfaces.getAppInfo)((0, _apps.apmAppId)('acl'), 'wrongNamespace');
  t.is(emptyDueToUnknownMapping, null);
  const emptyDueToUnknownApp = (0, _interfaces.getAppInfo)((0, _apps.apmAppId)('wrongApp'), 'aragon');
  t.is(emptyDueToUnknownApp, null);
});
(0, _ava.default)('interfaces: hasAppInfo', async t => {
  t.plan(11);
  const availableMappings = [['aragon', [(0, _apps.apmAppId)('acl'), (0, _apps.apmAppId)('evmreg'), (0, _apps.apmAppId)('kernel')]], ['apm', [(0, _apps.apmAppId)('apm-registry'), (0, _apps.apmAppId)('apm-repo'), (0, _apps.apmAppId)('apm-enssub'), (0, _apps.apmAppId)('apm-registry.open'), (0, _apps.apmAppId)('apm-repo.open'), (0, _apps.apmAppId)('apm-enssub.open')]]]; // assert

  availableMappings.forEach(([namespace, appIds]) => {
    appIds.forEach(appId => {
      t.true((0, _interfaces.hasAppInfo)(appId, namespace));
    });
  });
  t.false((0, _interfaces.hasAppInfo)((0, _apps.apmAppId)('acl'), 'wrongNamespace'));
  t.false((0, _interfaces.hasAppInfo)((0, _apps.apmAppId)('wrongApp'), 'aragon'));
});
//# sourceMappingURL=interfaces.test.js.map