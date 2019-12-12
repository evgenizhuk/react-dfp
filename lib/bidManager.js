"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var Utils = _interopRequireWildcard(require("./utils"));

var _manager = _interopRequireDefault(require("./manager"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var BidManager = {
  bidsScriptIsRequested: false,
  slots: {},
  bidsScriptLoadPromise: null,
  slotsHash: '',
  registerSlot: function registerSlot(slotID, sizes, adUnit) {
    this.slots[slotID] = {
      slotID: slotID,
      sizes: sizes,
      slotName: adUnit
    };
  },
  getSlotsByIDs: function getSlotsByIDs(IDs) {
    return this.getSlots().filter(function (slot) {
      return IDs.indexOf(slot.slotID) !== -1;
    });
  },
  getSlotsHash: function getSlotsHash(slots) {
    return slots.map(function (slot) {
      return slot.slotID;
    }).join('-');
  },
  unregisterSlot: function unregisterSlot(slotID) {
    delete this.slots[slotID];
  },
  areSlotsEmpty: function areSlotsEmpty() {
    return Object.values(this.slots).length === 0;
  },
  getSlots: function getSlots() {
    return Object.values(this.slots);
  },
  clearSlots: function clearSlots() {
    this.slots = {};
  },
  getBidsLoaderScript: function getBidsLoaderScript(config) {
    var _this = this;

    this.bidsScriptIsRequested = true;
    return _manager["default"].getGoogletag().then(function () {
      if (_this.bidsScriptLoadPromise === null) {
        _this.bidsScriptLoadPromise = Utils.loadBidsScript(config);
      }

      return _this.bidsScriptLoadPromise;
    })["catch"](function (error) {
      return console.info(error.message);
    });
  },
  requestBids: function requestBids(apstag) {
    var _this2 = this;

    var slots = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.getSlots();
    var slotsHash = this.getSlotsHash(slots);
    return new Promise(function (resolve, reject) {
      if (_this2.slotsHash === slotsHash) {
        reject();
        return;
      }

      _this2.slotsHash = slotsHash;
      apstag.fetchBids({
        slots: slots,
        timeout: 2e3
      }, function (bids) {
        if (bids.length > 0) {
          apstag.setDisplayBids();
          resolve();
          _this2.slotsHash = '';
        }
      });
    });
  },
  applyBids: function applyBids(slots) {
    return new Promise(function (resolve, reject) {
      if (BidManager.bidsScriptIsRequested && !BidManager.areSlotsEmpty()) {
        BidManager.getBidsLoaderScript().then(function (apstag) {
          return BidManager.requestBids(apstag, slots);
        })["catch"](function (error) {
          return console.error(error.message);
        }).then(resolve)["catch"](function () {
          console.info('Bids request is in progress');
        });
      } else {
        reject({
          message: 'Bids not applicable'
        });
      }
    });
  }
};
var _default = BidManager;
exports["default"] = _default;