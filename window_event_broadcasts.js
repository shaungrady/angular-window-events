// Module for broadcasting the following window events
// Written by Shaun Grady. Licensed under The MIT License (MIT).
// https://github.com/shaungrady/angular-window-events
// Version 0.1

angular.module('windowEventBroadcasts', []).
run(['$rootScope', '$window', '$document', function($rootScope, $window, $document) {
  var window = angular.element($window),
      vendorPrefix, prevEvent;

  // We'll let jQuery/jqLite handle cross-browser compatibility with window blur/focus
  // Blur events can be double-fired, so we'll filter those out with prevEvent tracking
  window.on('blur', function(event) {
    if (prevEvent !== 'blur')
      $rootScope.$broadcast('$windowBlur', event);
    prevEvent = 'blur';
  });

  window.on('focus', function(event) {
    if (prevEvent !== 'focus')
      $rootScope.$broadcast('$windowFocus', event);
    prevEvent = 'focus';
  });

  // With document visibility, we'll have to handle cross-browser compatibility ourselves
  // Compatibility: IE10+, FF10+, Chrome 14+, Safari 6.1+, Opera 12.1+, iOS Safari 7+
  // For more detailed compatibility statistics: http://caniuse.com/#feat=pagevisibility
  // Inspired by http://stackoverflow.com/q/1060008
  var visibilityChangeHandler = function visibilityChangeHandler(event) {
    if (this[vendorPrefix ? vendorPrefix + 'Hidden' : 'hidden'])
      $rootScope.$broadcast('$windowHide', event);
    else
      $rootScope.$broadcast('$windowShow', event);
  };

  // Determine if a vendor prefix is required to utilize the Page Visibility API
  if ('hidden' in $document)
    vendorPrefix = '';
  else
    angular.forEach(['moz', 'webkit', 'ms'], function(prefix) {
      if ((prefix + 'Hidden') in $document[0]) vendorPrefix = prefix;
    });

  if (angular.isDefined(vendorPrefix))
    $document[0].addEventListener(vendorPrefix + 'visibilitychange', visibilityChangeHandler);

}]);