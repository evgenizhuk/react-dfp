"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadGPTScript = loadGPTScript;
exports.loadBidsScript = loadBidsScript;

function doloadGPTScript(resolve, reject) {
  window.googletag = window.googletag || {};
  window.googletag.cmd = window.googletag.cmd || [];
  var scriptTag = document.createElement('script');
  scriptTag.src = "".concat(document.location.protocol, "//securepubads.g.doubleclick.net/tag/js/gpt.js");
  scriptTag.async = true;
  scriptTag.type = 'text/javascript';

  scriptTag.onerror = function scriptTagOnError(errs) {
    reject(errs);
  };

  scriptTag.onload = function scriptTagOnLoad() {
    resolve(window.googletag);
  };

  document.getElementsByTagName('head')[0].appendChild(scriptTag);
}

function doLoadBidsScript(amazonConfig, resolve, reject) {
  // Load the APS JavaScript Library
  try {
    /* eslint-disable */
    !function (a9, a, p, s, t, A, g) {
      if (a[a9]) return;

      function q(c, r) {
        a[a9]._Q.push([c, r]);
      }

      a[a9] = {
        init: function init() {
          q("i", arguments);
        },
        fetchBids: function fetchBids() {
          q("f", arguments);
        },
        setDisplayBids: function setDisplayBids() {},
        targetingKeys: function targetingKeys() {
          return [];
        },
        _Q: []
      };
      A = p.createElement(s);
      A.async = !0;
      A.src = t;
      g = p.getElementsByTagName(s)[0];
      g.parentNode.insertBefore(A, g);
    }("apstag", window, document, "script", "//c.amazon-adsystem.com/aax2/apstag.js");
    /* eslint-enable */
  } catch (error) {
    reject(error);
  }

  window.apstag.init(amazonConfig, function () {
    resolve(window.apstag);
  });
}

function loadGPTScript() {
  return new Promise(function (resolve, reject) {
    doloadGPTScript(resolve, reject);
  });
}

function loadBidsScript(config) {
  return new Promise(function (resolve, reject) {
    doLoadBidsScript(config, resolve, reject);
  });
}