"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _axios = _interopRequireDefault(require("axios"));

var _web3Utils = require("web3-utils");

var _AddressIdentityProvider = _interopRequireDefault(require("./AddressIdentityProvider"));

const BOX_SERVER_URL = 'https://ipfs.3box.io';

const extractImgHash = image => {
  const hash = image && image[0] && image[0].contentUrl && image[0].contentUrl['/'];
  return hash || null;
};

const noop = () => {};

class ThreeBoxIdentityProvider extends _AddressIdentityProvider.default {
  constructor(...args) {
    super(...args);
    (0, _defineProperty2.default)(this, "init", noop);
  }

  /**
   * Resolve the identity metadata for an address
   * Should resolve to null if an identity could not be found
   *
   * @param  {string} address Address to resolve
   * @return {Promise} Resolved metadata or rejected error
   */
  async resolve(address) {
    if (!address) {
      throw new Error('address is required when resolving a 3box identity');
    }

    if (!(0, _web3Utils.isAddress)(address)) {
      throw new Error('invalid address passed to 3box identity resolver');
    }

    try {
      const {
        data
      } = await _axios.default.get("".concat(BOX_SERVER_URL, "/profile?address=").concat(address.toLowerCase()));
      return {
        createdAt: null,
        name: data.name || address,
        imageCid: extractImgHash(data.image)
      };
    } catch (err) {
      // assume errors from 3box means the identity does not exist so we dont slow down any apps
      return null;
    }
  }

}

exports.default = ThreeBoxIdentityProvider;
//# sourceMappingURL=ThreeBoxIdentityProvider.js.map