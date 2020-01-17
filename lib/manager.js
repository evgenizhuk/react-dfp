"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _events = require("events");

var _bidManager = _interopRequireDefault(require("./bidManager"));

var Utils = _interopRequireWildcard(require("./utils"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var loadPromise = null;
var googleGPTScriptLoadPromise = null;
var singleRequestEnabled = true;
var disableInitialLoadEnabled = false;
var lazyLoadEnabled = false;
var lazyLoadConfig = null;
var servePersonalizedAds = true;
var registeredSlots = {};
var managerAlreadyInitialized = false;
var globalTargetingArguments = {};
var globalAdSenseAttributes = {};
var DFPManager = Object.assign(new _events.EventEmitter().setMaxListeners(0), {
  singleRequestIsEnabled: function singleRequestIsEnabled() {
    return singleRequestEnabled;
  },
  configureSingleRequest: function configureSingleRequest(value) {
    singleRequestEnabled = !!value;
  },
  disableInitialLoadIsEnabled: function disableInitialLoadIsEnabled() {
    return disableInitialLoadEnabled;
  },
  configureDisableInitialLoad: function configureDisableInitialLoad(value) {
    disableInitialLoadEnabled = !!value;
  },
  configureLazyLoad: function configureLazyLoad() {
    var enable = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
    var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var conf = null;

    if (config !== null && _typeof(config) === 'object') {
      conf = _objectSpread({}, config);
    }

    lazyLoadEnabled = !!enable;
    lazyLoadConfig = conf;
  },
  lazyLoadIsEnabled: function lazyLoadIsEnabled() {
    return lazyLoadEnabled;
  },
  getLazyLoadConfig: function getLazyLoadConfig() {
    return lazyLoadConfig;
  },
  getAdSenseAttribute: function getAdSenseAttribute(key) {
    return globalAdSenseAttributes[key];
  },
  configurePersonalizedAds: function configurePersonalizedAds(value) {
    servePersonalizedAds = value;
  },
  personalizedAdsEnabled: function personalizedAdsEnabled() {
    return servePersonalizedAds;
  },
  setAdSenseAttribute: function setAdSenseAttribute(key, value) {
    this.setAdSenseAttributes(_defineProperty({}, key, value));
  },
  getAdSenseAttributes: function getAdSenseAttributes() {
    return _objectSpread({}, globalAdSenseAttributes);
  },
  setAdSenseAttributes: function setAdSenseAttributes(attrs) {
    Object.assign(globalAdSenseAttributes, attrs);

    if (managerAlreadyInitialized === true) {
      this.getGoogletag().then(function (googletag) {
        googletag.cmd.push(function () {
          var pubadsService = googletag.pubads();
          Object.keys(globalAdSenseAttributes).forEach(function (key) {
            pubadsService.set(key, globalTargetingArguments[key]);
          });
        });
      });
    }
  },
  setTargetingArguments: function setTargetingArguments(data) {
    Object.assign(globalTargetingArguments, data);

    if (managerAlreadyInitialized === true) {
      this.getGoogletag().then(function (googletag) {
        googletag.cmd.push(function () {
          var pubadsService = googletag.pubads();
          Object.keys(globalTargetingArguments).forEach(function (varName) {
            if (pubadsService) {
              pubadsService.setTargeting(varName, globalTargetingArguments[varName]);
            }
          });
        });
      });
    }
  },
  getTargetingArguments: function getTargetingArguments() {
    return _objectSpread({}, globalTargetingArguments);
  },
  getSlotProperty: function getSlotProperty(slotId, propName) {
    var slot = this.getRegisteredSlots()[slotId];
    var ret = null;

    if (slot !== undefined) {
      ret = slot[propName] || ret;
    }

    return ret;
  },
  getSlotTargetingArguments: function getSlotTargetingArguments(slotId) {
    var propValue = this.getSlotProperty(slotId, 'targetingArguments');
    return propValue ? _objectSpread({}, propValue) : null;
  },
  getSlotAdSenseAttributes: function getSlotAdSenseAttributes(slotId) {
    var propValue = this.getSlotProperty(slotId, 'adSenseAttributes');
    return propValue ? _objectSpread({}, propValue) : null;
  },
  init: function init() {
    var _this = this;

    if (managerAlreadyInitialized === false) {
      managerAlreadyInitialized = true;
      this.getGoogletag().then(function (googletag) {
        googletag.cmd.push(function () {
          var pubadsService = googletag.pubads();
          pubadsService.addEventListener('slotRenderEnded', function (event) {
            var slotId = event.slot.getSlotElementId();

            _this.emit('slotRenderEnded', {
              slotId: slotId,
              event: event
            });
          });
          pubadsService.addEventListener('impressionViewable', function (event) {
            var slotId = event.slot.getSlotElementId();

            _this.emit('impressionViewable', {
              slotId: slotId,
              event: event
            });
          });
          pubadsService.addEventListener('slotVisibilityChanged', function (event) {
            var slotId = event.slot.getSlotElementId();

            _this.emit('slotVisibilityChanged', {
              slotId: slotId,
              event: event
            });
          });
          pubadsService.setRequestNonPersonalizedAds(_this.personalizedAdsEnabled() ? 0 : 1);
        });
      });
    }
  },
  getGoogletag: function getGoogletag() {
    if (googleGPTScriptLoadPromise === null) {
      googleGPTScriptLoadPromise = Utils.loadGPTScript();
    }

    return googleGPTScriptLoadPromise;
  },
  setCollapseEmptyDivs: function setCollapseEmptyDivs(collapse) {
    this.collapseEmptyDivs = collapse;
  },
  load: function load() {
    var _this2 = this;

    for (var _len = arguments.length, slots = new Array(_len), _key = 0; _key < _len; _key++) {
      slots[_key] = arguments[_key];
    }

    if (loadPromise === null) {
      loadPromise = this.doLoad.apply(this, slots);
    } else {
      loadPromise = loadPromise.then(function () {
        return _this2.doLoad.apply(_this2, slots);
      });
    }
  },
  doLoad: function doLoad() {
    this.init();
    var availableSlots = {};

    for (var _len2 = arguments.length, slots = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      slots[_key2] = arguments[_key2];
    }

    if (slots.length > 0) {
      availableSlots = slots.filter(function (slotId) {
        return Object.prototype.hasOwnProperty.call(registeredSlots, slotId);
      });
    } else {
      availableSlots = Object.keys(registeredSlots);
    }

    availableSlots = availableSlots.filter(function (id) {
      return !registeredSlots[id].loading && !registeredSlots[id].gptSlot;
    });
    availableSlots.forEach(function (slotId) {
      registeredSlots[slotId].loading = true;
    });
    return this.gptLoadAds(availableSlots);
  },
  gptLoadAds: function gptLoadAds(slotsToInitialize) {
    var _this3 = this;

    return new Promise(function (resolve) {
      _this3.getGoogletag().then(function (googletag) {
        slotsToInitialize.forEach(function (currentSlotId) {
          registeredSlots[currentSlotId].loading = false;
          googletag.cmd.push(function () {
            var slot = registeredSlots[currentSlotId];
            var gptSlot;
            var adUnit = "".concat(slot.dfpNetworkId, "/").concat(slot.adUnit);

            if (slot.renderOutOfThePage === true) {
              gptSlot = googletag.defineOutOfPageSlot(adUnit, currentSlotId);
            } else {
              gptSlot = googletag.defineSlot(adUnit, slot.sizes, currentSlotId);
            }

            if (gptSlot !== null) {
              slot.gptSlot = gptSlot;

              var slotTargetingArguments = _this3.getSlotTargetingArguments(currentSlotId);

              if (slotTargetingArguments !== null) {
                Object.keys(slotTargetingArguments).forEach(function (varName) {
                  if (slot && slot.gptSlot) {
                    slot.gptSlot.setTargeting(varName, slotTargetingArguments[varName]);
                  }
                });
              }

              var slotAdSenseAttributes = _this3.getSlotAdSenseAttributes(currentSlotId);

              if (slotAdSenseAttributes !== null) {
                Object.keys(slotAdSenseAttributes).forEach(function (varName) {
                  slot.gptSlot.set(varName, slotAdSenseAttributes[varName]);
                });
              }

              slot.gptSlot.addService(googletag.pubads());

              if (slot.sizeMapping) {
                var smbuilder = googletag.sizeMapping();
                slot.sizeMapping.forEach(function (mapping) {
                  smbuilder = smbuilder.addSize(mapping.viewport, mapping.sizes);
                });
                slot.gptSlot.defineSizeMapping(smbuilder.build());
              }
            }
          });
        });

        _this3.configureOptions(googletag);

        googletag.cmd.push(function () {
          googletag.enableServices();

          _bidManager["default"].applyBids()["catch"](function (err) {
            return console.log(err.message);
          })["finally"](function () {
            if (!_this3.disableInitialLoadIsEnabled()) {
              slotsToInitialize.forEach(function (theSlotId) {
                googletag.display(theSlotId);
              });
            }
          });

          resolve();
        });
      });
    });
  },
  configureOptions: function configureOptions(googletag) {
    var _this4 = this;

    googletag.cmd.push(function () {
      var pubadsService = googletag.pubads();
      pubadsService.setRequestNonPersonalizedAds(_this4.personalizedAdsEnabled() ? 0 : 1);

      var targetingArguments = _this4.getTargetingArguments(); // set global targetting arguments


      Object.keys(targetingArguments).forEach(function (varName) {
        if (pubadsService) {
          pubadsService.setTargeting(varName, targetingArguments[varName]);
        }
      }); // set global adSense attributes

      var adSenseAttributes = _this4.getAdSenseAttributes();

      Object.keys(adSenseAttributes).forEach(function (key) {
        pubadsService.set(key, adSenseAttributes[key]);
      });

      if (_this4.lazyLoadIsEnabled()) {
        var args = [];

        var config = _this4.getLazyLoadConfig();

        if (config !== null) {
          args.push(config);
        }

        pubadsService.enableLazyLoad.call(args);
      }

      if (_this4.singleRequestIsEnabled()) {
        pubadsService.enableSingleRequest();
      }

      if (_this4.disableInitialLoadIsEnabled()) {
        pubadsService.disableInitialLoad();
      }

      if (_this4.collapseEmptyDivs === true || _this4.collapseEmptyDivs === false) {
        pubadsService.collapseEmptyDivs(_this4.collapseEmptyDivs);
      }
    });
  },
  getRefreshableSlots: function getRefreshableSlots() {
    var slots = {};

    for (var _len3 = arguments.length, slotsArray = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      slotsArray[_key3] = arguments[_key3];
    }

    if (slotsArray.length === 0) {
      var slotsToRefresh = Object.keys(registeredSlots).map(function (k) {
        return registeredSlots[k];
      });
      return slotsToRefresh.reduce(function (last, slot) {
        if (slot.slotShouldRefresh() === true) {
          slots[slot.slotId] = slot;
        }

        return slots;
      }, slots);
    }

    return slotsArray.reduce(function (last, slotId) {
      var slot = registeredSlots[slotId];

      if (typeof slot !== 'undefined') {
        slots[slotId] = slot;
      }

      return slots;
    }, slots);
  },
  refresh: function refresh() {
    var _this5 = this;

    for (var _len4 = arguments.length, slots = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      slots[_key4] = arguments[_key4];
    }

    if (loadPromise === null) {
      this.load();
    } else {
      _bidManager["default"].applyBids(_bidManager["default"].getSlotsByIDs(slots))["catch"](function (err) {
        return console.log(err.message);
      })["finally"](function () {
        _this5.gptRefreshAds(Object.keys(_this5.getRefreshableSlots.apply(_this5, slots)));
      });
    }
  },
  gptRefreshAds: function gptRefreshAds(slots) {
    var _this6 = this;

    return this.getGoogletag().then(function (googletag) {
      _this6.configureOptions(googletag);

      googletag.cmd.push(function () {
        var pubadsService = googletag.pubads();
        pubadsService.refresh(slots.map(function (slotId) {
          return registeredSlots[slotId].gptSlot;
        }));
      });
    });
  },
  reload: function reload() {
    var _this7 = this;

    return this.destroyGPTSlots.apply(this, arguments).then(function () {
      return _this7.load();
    });
  },
  destroyGPTSlots: function destroyGPTSlots() {
    var _this8 = this;

    for (var _len5 = arguments.length, slotsToDestroy = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
      slotsToDestroy[_key5] = arguments[_key5];
    }

    if (slotsToDestroy.length === 0) {
      // eslint-disable-next-line no-param-reassign
      slotsToDestroy = Object.keys(registeredSlots);
    }

    return new Promise(function (resolve) {
      var slots = []; // eslint-disable-next-line guard-for-in,no-restricted-syntax

      for (var idx in slotsToDestroy) {
        var slotId = slotsToDestroy[idx];
        var slot = registeredSlots[slotId];
        slots.push(slot);
      }

      _this8.getGoogletag().then(function (googletag) {
        googletag.cmd.push(function () {
          if (managerAlreadyInitialized === true) {
            if (slotsToDestroy.length > 0) {
              // eslint-disable-next-line guard-for-in,no-restricted-syntax
              for (var _idx in slots) {
                var _slot = slots[_idx];
                slots.push(_slot.gptSlot);
                delete _slot.gptSlot;
              }

              googletag.destroySlots(slots);
            } else {
              googletag.destroySlots();
            }
          }

          resolve(slotsToDestroy);
        });
      });
    });
  },
  registerSlot: function registerSlot(_ref) {
    var _this9 = this;

    var slotId = _ref.slotId,
        dfpNetworkId = _ref.dfpNetworkId,
        adUnit = _ref.adUnit,
        sizes = _ref.sizes,
        renderOutOfThePage = _ref.renderOutOfThePage,
        sizeMapping = _ref.sizeMapping,
        adSenseAttributes = _ref.adSenseAttributes,
        targetingArguments = _ref.targetingArguments,
        slotShouldRefresh = _ref.slotShouldRefresh;
    var autoLoad = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    if (!Object.prototype.hasOwnProperty.call(registeredSlots, slotId)) {
      registeredSlots[slotId] = {
        slotId: slotId,
        sizes: sizes,
        renderOutOfThePage: renderOutOfThePage,
        dfpNetworkId: dfpNetworkId,
        adUnit: adUnit,
        adSenseAttributes: adSenseAttributes,
        targetingArguments: targetingArguments,
        sizeMapping: sizeMapping,
        slotShouldRefresh: slotShouldRefresh,
        loading: false
      };
      this.emit('slotRegistered', {
        slotId: slotId
      });

      if (autoLoad === true && loadPromise !== null) {
        loadPromise = loadPromise["catch"]().then(function () {
          var slot = registeredSlots[slotId];

          if (typeof slot !== 'undefined') {
            var loading = slot.loading,
                gptSlot = slot.gptSlot;

            if (loading === false && !gptSlot) {
              _this9.load(slotId);
            }
          }
        });
      }
    }
  },
  unregisterSlot: function unregisterSlot(_ref2) {
    var slotId = _ref2.slotId;
    this.destroyGPTSlots(slotId);

    _bidManager["default"].unregisterSlot(slotId);

    delete registeredSlots[slotId];
  },
  getRegisteredSlots: function getRegisteredSlots() {
    return registeredSlots;
  },
  attachSlotRenderEnded: function attachSlotRenderEnded(cb) {
    this.on('slotRenderEnded', cb);
  },
  detachSlotRenderEnded: function detachSlotRenderEnded(cb) {
    this.removeListener('slotRenderEnded', cb);
  },
  attachSlotVisibilityChanged: function attachSlotVisibilityChanged(cb) {
    this.on('slotVisibilityChanged', cb);
  },
  detachSlotVisibilityChanged: function detachSlotVisibilityChanged(cb) {
    this.removeListener('slotVisibilityChanged', cb);
  },
  attachSlotIsViewable: function attachSlotIsViewable(cb) {
    this.on('impressionViewable', cb);
  },
  detachSlotIsViewable: function detachSlotIsViewable(cb) {
    this.removeListener('impressionViewable', cb);
  }
});
var _default = DFPManager;
exports["default"] = _default;