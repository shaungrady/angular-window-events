'use strict'

var angular = require('angular')

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
