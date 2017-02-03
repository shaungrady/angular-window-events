/**
 * angular-window-events v1.1.3
 * Shaun Grady, 2017
 * https://github.com/shaungrady/angular-window-events
 * Module Format: CommonJS
 * License: MIT
 */

module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("angular");

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _angular = __webpack_require__(0);

var _angular2 = _interopRequireDefault(_angular);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = windowStateService;


windowStateService.$inject = ['$rootScope', '$window'];
function windowStateService($rootScope, $window) {
  var supportedEvents = ['focus', 'blur', 'show', 'hide'];

  var win = _angular2.default.element($window);
  var doc = win[0].document;

  var handlersByEvent = {};
  var hasVisibilitySupport = false;
  var isShowing = void 0;
  var isFocused = doc.hasFocus();
  var hiddenProperty = void 0;
  var vendorPrefix = '';
  var previousEvent = void 0;

  supportedEvents.forEach(function (eventType) {
    handlersByEvent[eventType] = [];
  });

  /**
   * Event Handling
   */

  function on(eventType, handler) {
    if (supportedEvents.indexOf(eventType) === -1) throw new Error('Unsupported window event type');
    handlersByEvent[eventType].push(handler);
    return off.bind({}, eventType, handler);
  }

  function off(eventType, handler) {
    if (supportedEvents.indexOf(eventType) === -1) throw new Error('Unsupported window event type');
    var handlers = handlersByEvent[eventType];
    // Remove all handlers
    if (!handler) handlersByEvent[eventType] = [];
    // Remove specific handler
    else {
        var handlerIndex = handlers.indexOf(handler);
        if (handlerIndex > -1) handlers.splice(handlerIndex, 1);
      }
  }

  function trigger(eventType, event) {
    var eventName = 'window' + eventType[0].toUpperCase() + eventType.substr(1);
    var handlers = handlersByEvent[eventType];
    $rootScope.$broadcast(eventName, event, eventType);
    handlers.forEach(function (handler) {
      return handler.call({}, event, eventType);
    });
  }

  /**
   * Page Visibility (Hide/Show Event Listening)
   */

  // Determine vendor prefix requirement for Page Visibility API
  if ('hidden' in doc) hiddenProperty = 'hidden';else {
    ;['moz', 'webkit'].forEach(function (prefix) {
      if (prefix + 'Hidden' in doc) {
        hiddenProperty = prefix + 'Hidden';
        vendorPrefix = prefix;
      }
    });
  }

  // Support for Page Visibility API?
  if (hiddenProperty) {
    hasVisibilitySupport = true;
    updatePageVisibility();
    doc.addEventListener(vendorPrefix + 'visibilitychange', updatePageVisibility);
  }

  function updatePageVisibility(event) {
    var isHidden = doc[hiddenProperty];
    var eventType = isHidden ? 'hide' : 'show';
    isShowing = eventType === 'show';
    if (event) trigger(eventType, event);
  }

  /**
   * Blur/Focus Event Listening
   */

  ;['blur', 'focus'].forEach(function (eventType) {
    // We'll let jQuery/jqLite handle cross-browser compatibility with window blur/focus
    // We have to track previous event to prevent event double-firing
    win.on(eventType, function (event) {
      if (previousEvent === eventType) return;
      previousEvent = eventType;
      isFocused = eventType === 'focus';
      trigger(eventType, event);
    });
  });

  return Object.freeze({
    get hasVisibilitySupport() {
      return hasVisibilitySupport;
    },
    get isShowing() {
      return isShowing;
    },
    get isHidden() {
      return !isShowing;
    },
    get isFocused() {
      return isFocused;
    },
    get isBlurred() {
      return !isFocused;
    },
    on: on,
    off: off
  });
}

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _angular = __webpack_require__(0);

var _angular2 = _interopRequireDefault(_angular);

var _service = __webpack_require__(1);

var _service2 = _interopRequireDefault(_service);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _angular2.default.module('window-events', []).service('windowState', _service2.default)
// Instantiate service for broadcasts
.run(['windowState', function (windowState) {}]).name;

/***/ })
/******/ ]);