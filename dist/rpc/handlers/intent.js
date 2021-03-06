"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

async function _default(request, proxy, wrapper) {
  const [methodSignature, ...params] = request.params;

  if (!methodSignature) {
    throw new Error('Invalid intent operation: no method name');
  }

  const transactionPath = await wrapper.getTransactionPath(proxy.address, methodSignature, params);
  return wrapper.performTransactionPath(transactionPath);
}
//# sourceMappingURL=intent.js.map