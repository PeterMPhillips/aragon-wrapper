"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _AddressIdentityProvider = _interopRequireDefault(require("./AddressIdentityProvider"));

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _index = require("../utils/index");

var _apps = require("../utils/apps");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

const addressBookAppIds = [(0, _apps.apmAppId)('address-book'), (0, _apps.apmAppId)('address-book.open'), (0, _apps.apmAppId)('address-book-experimental.open'), (0, _apps.apmAppId)('tps-address-book.open'), (0, _apps.apmAppId)('address-book-staging.open'), (0, _apps.apmAppId)('address-book.hatch')];
/**
 * An identity provider for Address Book Entries
 *
 * @extends AddressIdentityProvider
 */

class AddressBookIdentityProvider extends _AddressIdentityProvider.default {
  /**
   * Create a new identity Provider that queries installed Address Book apps
   * @param {Observable} apps apps Observable from the wrapper
   * @param {Cache} cache the cache instance utilized by the wrapper
   */
  constructor(apps, cache) {
    super();
    this.apps = apps;
    this.cache = cache;
  }
  /**
   * Resolve the identity metadata for an address
   * Should resolve to null if an identity does not exist
   * Will return the first successful resolution                                                                                                                                                                                                                                tity could not be found
   *
   * @param  {string} address Address to resolve
   * @return {Promise} Resolves with identity metadata or null if not found
   */


  async resolve(address) {
    address = address.toLowerCase();
    return this.apps.pipe((0, _operators.concatAll)(), (0, _operators.filter)(app => addressBookAppIds.includes(app.appId)), (0, _operators.map)(async app => {
      const cacheKey = (0, _index.getCacheKey)(app.proxyAddress, 'state');
      const {
        entries = []
      } = await this.cache.get(cacheKey);
      const {
        data: metadata
      } = entries.find(entry => entry.addr.toLowerCase() === address) || {};
      if (!metadata) return null;
      metadata.source = 'addressBook';
      return metadata;
    }), (0, _operators.flatMap)(pendingEntryData => (0, _rxjs.from)(pendingEntryData)), (0, _operators.defaultIfEmpty)(null), (0, _operators.first)()).toPromise();
  }
  /**
   * Search for matches in the installed address books.
   *
   * If the search term starts with '0x', addresses will be matched for instead.
   *
   * @param  {string} searchTerm Search term
   * @return {Promise} Resolved with array of matches, each containing the address and name
   */


  async search(searchTerm = '') {
    const isAddressSearch = searchTerm.substring(0, 2).toLowerCase() === '0x';
    const identities = await this.getAll();
    const results = Object.entries(identities).filter(([address, {
      name
    }]) => isAddressSearch && searchTerm.length > 3 && address.toLowerCase().indexOf(searchTerm.toLowerCase()) === 0 || name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1).map(([address, {
      name
    }]) => ({
      name,
      address
    }));
    return results;
  }
  /**
   * get all identities from all installed address book instances
   *
   * @return {Promise} Resolved with an object of all identities when completed
   */


  async getAll() {
    return this.apps.pipe((0, _operators.first)(), (0, _operators.concatAll)(), (0, _operators.filter)(app => addressBookAppIds.includes(app.appId)), (0, _operators.reduce)(async (allEntries, app) => {
      const cacheKey = (0, _index.getCacheKey)(app.proxyAddress, 'state');
      const {
        entries = []
      } = await this.cache.get(cacheKey);
      const allEntriesResolved = await allEntries;
      const entriesObject = entries.reduce((obj, entry) => {
        return _objectSpread({}, obj, {
          [entry.addr.toLowerCase()]: entry.data
        });
      }, {}); // ensure the entries retrieved from the first-installed address book aren't overwritten

      return _objectSpread({}, entriesObject, {}, allEntriesResolved);
    }, Promise.resolve({}))).toPromise();
  }
  /**
   * Modify the identity metadata of an address
   *
   * @param  {string} address  Address to resolve
   * @param  {Object} metadata Metadata to modify
   * @return {Promise} Resolved success action or rejected error
   */


  async modify(address, metadata) {
    throw new Error('Use the Address Book to change this label, or create your own local label');
  }

}

exports.default = AddressBookIdentityProvider;
//# sourceMappingURL=AddressBookIdentityProvider.js.map