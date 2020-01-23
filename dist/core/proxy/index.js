"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _configuration = require("../../configuration");

var configurationKeys = _interopRequireWildcard(require("../../configuration/keys"));

var _events = require("../../utils/events");

class ContractProxy {
  constructor(address, jsonInterface, web3, {
    initializationBlock = 0
  } = {}) {
    this.address = address;
    this.contract = new web3.eth.Contract(jsonInterface, address);
    this.web3 = web3;
    this.initializationBlock = initializationBlock;
  }
  /**
   * Fetches past events for a given block range
   *
   * @param {Array<String>} eventNames events to fetch
   * @param {Object} [options] web3.eth.Contract.getPastEvents()' options
   *   The fromBlock is defaulted to this app's initializationBlock unless explicitly provided
   * @return {Observable} Single-emission observable with an array of past events
   */


  pastEvents(eventNames, options = {}) {
    options.fromBlock = options.fromBlock || this.initializationBlock;
    eventNames = (0, _events.getEventNames)(eventNames); // The `from`s only unpack the returned Promises (and not the array inside them!)

    if (eventNames.length === 1) {
      // Get a specific event or all events unfiltered
      return (0, _rxjs.from)(this.contract.getPastEvents(eventNames[0], options));
    } else {
      // Get all events and filter ourselves
      return (0, _rxjs.from)(this.contract.getPastEvents('allEvents', options).then(events => events.filter(event => eventNames.includes(event.event))));
    }
  }
  /**
   * Subscribe to events, fetching past events if necessary (based on the given options)
   *
   * @param {Array<String>} eventNames events to fetch
   * @param {Object} options web3.eth.Contract.events()' options
   *   The fromBlock is defaulted to this app's initializationBlock unless explicitly provided
   * @return {Observable} Multi-emission observable with individual events
   */


  events(eventNames, options = {}) {
    options.fromBlock = options.fromBlock || this.initializationBlock;
    eventNames = (0, _events.getEventNames)(eventNames);
    let eventSource;

    if (eventNames.length === 1) {
      // Get a specific event or all events unfiltered
      eventSource = (0, _rxjs.fromEvent)(this.contract.events[eventNames[0]](options), 'data');
    } else {
      // Get all events and filter ourselves
      eventSource = (0, _rxjs.fromEvent)(this.contract.events.allEvents(options), 'data').pipe((0, _operators.filter)(event => eventNames.includes(event.event)));
    }

    const eventDelay = (0, _configuration.getConfiguration)(configurationKeys.SUBSCRIPTION_EVENT_DELAY) || 0; // Small optimization: don't pipe a delay if we don't have to

    return eventDelay ? eventSource.pipe((0, _operators.delay)(eventDelay)) : eventSource;
  }

  async call(method, ...params) {
    if (!this.contract.methods[method]) {
      throw new Error("No method named ".concat(method, " on ").concat(this.address));
    }

    const lastParam = params[params.length - 1];
    return typeof lastParam === 'object' && lastParam !== null ? this.contract.methods[method](...params.slice(0, -1)).call(lastParam) : this.contract.methods[method](...params).call();
  }

  async updateInitializationBlock() {
    const initBlock = await this.contract.methods.getInitializationBlock().call();
    this.initializationBlock = initBlock;
  }

}

exports.default = ContractProxy;
//# sourceMappingURL=index.js.map