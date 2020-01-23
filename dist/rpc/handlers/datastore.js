"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
const METHOD_WHITELIST = new Set(['add', 'cat', 'dagPut', 'dagGet', 'setHost']);

async function _default(request, proxy, wrapper) {
  const datastore = wrapper.datastore;
  const [method, ...params] = request.params;
  return METHOD_WHITELIST.has(method) ? Promise.resolve(datastore[method](...params)) : Promise.reject(new Error("Given datastore method (".concat(method, ") is not whitelisted")));
}
//# sourceMappingURL=datastore.js.map