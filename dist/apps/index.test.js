"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _ava = _interopRequireDefault(require("ava"));

var _index = _interopRequireWildcard(require("./index"));

(0, _ava.default)('AppContextPool starts empty', async t => {
  // arrange
  const appAddress = '0x12';
  const pool = new _index.default(); // assert

  t.false(pool.hasApp(appAddress));
});
(0, _ava.default)('AppContextPool can create new app context when retrieving a context for first time', async t => {
  // arrange
  const appAddress = '0x12';
  const pool = new _index.default();
  t.false(pool.hasApp(appAddress)); // act

  pool.get(appAddress, _index.APP_CONTEXTS.PATH); // assert

  t.true(pool.hasApp(appAddress));
});
(0, _ava.default)('AppContextPool can create new app context when emitting initial value', async t => {
  // arrange
  const appAddress = '0x12';
  const pool = new _index.default();
  t.false(pool.hasApp(appAddress)); // act

  pool.emit(appAddress, _index.APP_CONTEXTS.PATH, '/vote'); // assert

  t.true(pool.hasApp(appAddress));
});
(0, _ava.default)('AppContextPool can read and write values to path context', async t => {
  // arrange
  const appAddress = '0x12';
  const pool = new _index.default(); // assert

  const context = pool.get(appAddress, _index.APP_CONTEXTS.PATH);
  let counter = 0;
  context.subscribe(val => {
    if (counter === 0) {
      t.is(val, null);
    } else if (counter === 1) {
      t.is(val, '/first');
    } else if (counter === 2) {
      t.is(val, '/second');
    } else {
      t.fail('too many emissions');
    }

    counter++;
  }); // act

  pool.emit(appAddress, _index.APP_CONTEXTS.PATH, '/first');
  pool.emit(appAddress, _index.APP_CONTEXTS.PATH, '/second');
});
(0, _ava.default)('AppContextPool can read and write values to trigger context', async t => {
  // arrange
  const appAddress = '0x12';
  const pool = new _index.default(); // assert

  const context = pool.get(appAddress, _index.APP_CONTEXTS.TRIGGER);
  let counter = 0;
  context.subscribe(val => {
    if (counter === 0) {
      t.is(val.event, 'first');
      t.deepEqual(val.returnValues, {});
    } else if (counter === 1) {
      t.is(val.event, 'second');
      t.deepEqual(val.returnValues, {});
    } else {
      t.fail('too many emissions');
    }

    counter++;
  }); // act

  pool.emit(appAddress, _index.APP_CONTEXTS.TRIGGER, {
    event: 'first',
    returnValues: {}
  });
  pool.emit(appAddress, _index.APP_CONTEXTS.TRIGGER, {
    event: 'second',
    returnValues: {}
  });
});
//# sourceMappingURL=index.test.js.map