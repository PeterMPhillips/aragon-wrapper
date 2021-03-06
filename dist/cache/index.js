"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classPrivateFieldGet2 = _interopRequireDefault(require("@babel/runtime/helpers/classPrivateFieldGet"));

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _localforage = _interopRequireDefault(require("localforage"));

var _localforageMemoryStorageDriver = _interopRequireDefault(require("localforage-memoryStorageDriver"));

var _configuration = require("../configuration");

var configurationKeys = _interopRequireWildcard(require("../configuration/keys"));

/**
 * A persistent cache on browser environments, preferring IndexedDB when available.
 * Falls back to an in-memory cache on node environments.
 *
 * @param {string} prefix
 *        String prefix to use for the cache
 * @param {Object} [options]
 *        Options
 * @param {boolean} [options.forceLocalStorage]
 *        Require the cache to downgrade to localstorage even if IndexedDB is available
 */
class Cache {
  constructor(prefix) {
    _trackedKeys.set(this, {
      writable: true,
      value: new Set()
    });

    this.prefix = prefix;
    const forceLocalStorage = (0, _configuration.getConfiguration)(configurationKeys.FORCE_LOCAL_STORAGE);
    this.drivers = forceLocalStorage ? [_localforage.default.LOCALSTORAGE, _localforageMemoryStorageDriver.default] : [_localforage.default.INDEXEDDB, _localforage.default.LOCALSTORAGE, _localforageMemoryStorageDriver.default];
  }

  async init() {
    // Set up the changes observable
    this.changes = new _rxjs.Subject(); // Set up cache DB

    this.db = _localforage.default.createInstance({
      driver: this.drivers,
      name: "localforage/".concat(this.prefix)
    });

    try {
      // Make sure localforage has settled down and is not waiting for anything else
      // before possibly setting new drivers
      await this.db.ready();
    } catch (err) {
      // If localforage isn't able to automatically connect to a driver
      // due to lack of support in the environment (e.g. node),
      // use an in-memory driver instead
      // TODO: this doesn't provide an persistent cache for node
      if (this.db.driver() === null) {
        await this.db.defineDriver(_localforageMemoryStorageDriver.default);
        await this.db.setDriver(_localforageMemoryStorageDriver.default._driver);
      }

      await this.db.ready();
    }
  }

  async set(key, value) {
    await this.db.setItem(key, value);
    this.changes.next({
      key,
      value
    });
  }

  async get(key, defaultValue = null) {
    // If we access a key without data the promise resolve but value is null
    const value = await this.db.getItem(key);
    return value || defaultValue;
  }

  async getAll() {
    const all = {};
    await this.db.iterate((value, key) => {
      all[key] = value;
    });
    return all;
  }

  async remove(key) {
    await this.db.removeItem(key);
    this.changes.next({
      key,
      value: null
    });
  }

  async clear() {
    await this.db.clear();

    for (const key of (0, _classPrivateFieldGet2.default)(this, _trackedKeys)) {
      this.changes.next({
        key,
        value: null
      });
    }
  }
  /**
   * Observe the value of a key in cache over time
   *
   * @param  {string} key
   * @param  {*}      defaultValue
   * @return {Observable}
   */


  observe(key, defaultValue) {
    (0, _classPrivateFieldGet2.default)(this, _trackedKeys).add(key);
    const getResult$ = this.get(key, defaultValue);
    const keyChange$ = this.changes.pipe((0, _operators.filter)(change => change.key === key), (0, _operators.pluck)('value'));
    /*
     * There is an inherent race between `this.get()` and a new item being set
     * on the cache key. Note that `concat()` only subscribes to the next observable
     * **AFTER** the previous one ends (it doesn't buffer hot observables).
     *
     * Thus, we either want:
     *   - The concatenated result of `this.get()` and `this.changes`, if `this.changes`
     *     doesn't emit new items, or
     *   - Just `this.changes` since `this.get()` may be stale by the time it returns
     */

    return (0, _rxjs.race)((0, _rxjs.concat)(getResult$, keyChange$), keyChange$);
  }

}

exports.default = Cache;

var _trackedKeys = new WeakMap();
//# sourceMappingURL=index.js.map