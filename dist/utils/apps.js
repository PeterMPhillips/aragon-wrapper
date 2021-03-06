"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findAppMethodFromData = findAppMethodFromData;
exports.knownAppIds = exports.apmAppId = void 0;

var _ethEnsNamehash = require("eth-ens-namehash");

var _jsSha = require("js-sha3");

const apmAppId = appName => (0, _ethEnsNamehash.hash)("".concat(appName, ".aragonpm.eth"));
/**
 * Find the method descriptor corresponding to the data component of a
 * transaction sent to `app`.
 *
 * @param  {Object} app App artifact
 * @param  {Object} data Data component of a transaction to app
 * @return {Object} Method with radspec notice and function signature
 */


exports.apmAppId = apmAppId;

function findAppMethodFromData(app, data) {
  if (app && app.functions) {
    // Find the method
    const methodId = data.substring(2, 10);
    return app.functions.find(method => (0, _jsSha.keccak256)(method.sig).substring(0, 8) === methodId);
  }
}

const knownAppIds = [apmAppId('finance'), apmAppId('token-manager'), apmAppId('vault'), apmAppId('voting')];
exports.knownAppIds = knownAppIds;
//# sourceMappingURL=apps.js.map