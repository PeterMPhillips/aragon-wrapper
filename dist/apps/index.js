"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.APP_CONTEXTS = void 0;

var _classPrivateFieldGet2 = _interopRequireDefault(require("@babel/runtime/helpers/classPrivateFieldGet"));

var _rxjs = require("rxjs");

const contextInstantiators = {
  path: () => new _rxjs.BehaviorSubject(null),
  trigger: () => new _rxjs.Subject()
};

class AppContext {
  constructor(appAddress) {
    this.appAddress = appAddress;
    Object.entries(contextInstantiators).forEach(([context, instantiator]) => {
      this[context] = instantiator();
    });
  }

  get(context) {
    if (!this[context]) {
      throw new Error("Could not find internal context '".concat(context, "' on ").concat(this.appAddress));
    }

    return this[context];
  }

}

const APP_CONTEXTS = Object.keys(contextInstantiators).reduce((contexts, context) => {
  contexts[context.toUpperCase()] = context;
  return contexts;
}, {});
exports.APP_CONTEXTS = APP_CONTEXTS;

class AppContextPool {
  constructor() {
    _appContexts.set(this, {
      writable: true,
      value: new Map()
    });
  }

  hasApp(appAddress) {
    return (0, _classPrivateFieldGet2.default)(this, _appContexts).has(appAddress);
  }

  get(appAddress, context) {
    let appContext = (0, _classPrivateFieldGet2.default)(this, _appContexts).get(appAddress);

    if (!appContext) {
      appContext = new AppContext();
      (0, _classPrivateFieldGet2.default)(this, _appContexts).set(appAddress, appContext);
    }

    return appContext.get(context);
  }

  emit(appAddress, context, value) {
    this.get(appAddress, context).next(value);
  }

}

exports.default = AppContextPool;

var _appContexts = new WeakMap();
//# sourceMappingURL=index.js.map