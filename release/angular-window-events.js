(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.angularWindowEvents = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
(function (global){
'use strict'

var angular = (typeof window !== "undefined" ? window['angular'] : typeof global !== "undefined" ? global['angular'] : null)

module.exports = angular
  .module('window-events', [])
  .run(['$rootScope', '$window', '$document', function ($rootScope, $window, $document) {
    'use strict'

    var win = angular.element($window)
    var vendorPrefix
    var prevEvent

    // We'll let jQuery/jqLite handle cross-browser compatibility with window blur/focus
    // Blur events can be double-fired, so we'll filter those out with prevEvent tracking
    win.on('blur', function (event) {
      if (prevEvent === 'blur') return
      $rootScope.$broadcast('windowBlur', event)
      prevEvent = 'blur'
    })

    win.on('focus', function (event) {
      if (prevEvent === 'focus') return
      $rootScope.$broadcast('windowFocus', event)
      prevEvent = 'focus'
    })

    // With document visibility, we'll have to handle cross-browser compatibility ourselves
    // Compatibility: IE10+, FF10+, Chrome 14+, Safari 6.1+, Opera 12.1+, iOS Safari 7+
    // For more detailed compatibility statistics: http://caniuse.com/#feat=pagevisibility
    // Inspired by http://stackoverflow.com/q/1060008
    var visibilityChangeHandler = function visibilityChangeHandlerFn (event) {
      if (this[vendorPrefix ? vendorPrefix + 'Hidden' : 'hidden']) {
        $rootScope.$broadcast('windowHide', event)
      } else {
        $rootScope.$broadcast('windowShow', event)
      }
    }

    // Determine if a vendor prefix is required to utilize the Page Visibility API
    if ('hidden' in $document) {
      vendorPrefix = ''
    } else {
      angular.forEach(['moz', 'webkit', 'ms'], function (prefix) {
        if ((prefix + 'Hidden') in $document[0]) {
          vendorPrefix = prefix
        }
      })
    }

    if (vendorPrefix !== undefined) {
      $document[0].addEventListener(vendorPrefix + 'visibilitychange', visibilityChangeHandler)
    }
  }])

  .name

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1])(1)
});