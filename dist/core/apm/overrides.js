"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.shouldOverrideAppWithLatestVersion = shouldOverrideAppWithLatestVersion;

var _utils = require("../../utils");

const MAINNET_AGENT_REPO = '0x52AC38791EF1561b172Ca89d7115F178d058E57b';
const MAINNET_UNLISTED_AGENT_V5 = '0x3A93C17FC82CC33420d1809dDA9Fb715cc89dd37';

function shouldOverrideAppWithLatestVersion(repoAddress, codeAddress) {
  if ((0, _utils.addressesEqual)(repoAddress, MAINNET_AGENT_REPO) && (0, _utils.addressesEqual)(codeAddress, MAINNET_UNLISTED_AGENT_V5)) {
    // Unlisted mainnet Agent v5 with NFT hotfix
    // See https://github.com/aragon/deployments/issues/176
    return true;
  }

  return false;
}
//# sourceMappingURL=overrides.js.map