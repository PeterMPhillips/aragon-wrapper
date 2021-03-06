"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getEventNames = getEventNames;

function getEventNames(eventNames) {
  // Get all events
  if (!eventNames) {
    return ['allEvents'];
  } // Convert `eventNames` to an array in order to
  // support `.events(name)` and `.events([a, b])`


  if (!Array.isArray(eventNames)) {
    eventNames = [eventNames];
  }

  return eventNames;
}
//# sourceMappingURL=events.js.map