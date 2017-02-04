angular-window-events
=====================
[![npm version](https://badge.fury.io/js/angular-window-events.svg)](https://badge.fury.io/js/angular-window-events)
[![Build Status](https://travis-ci.org/shaungrady/angular-window-events.svg?branch=master)](https://travis-ci.org/shaungrady/angular-window-events)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

Easy window event handling! Support `focus`, `blur`, `show`, and `hide`.

- Support for `$broadcast`ing of events.
- A `windowState` service for tracking state and adding event handlers.
- Support for `show` and `hide` for browsers that support the [W3C *Page Visibility* spec](http://www.w3.org/TR/page-visibility/#sec-page-visibility).
- Support for IE9 and up. IE10 if you want `show` and `hide` support.

**Usage Example**

``` javascript
angular
  .module('myApp', [
    'window-events'
  ])

  .controller('MyCtrl', function ($scope, windowState) {
    if (windowState.isShowing) alert('Hello!')

    var deregisterHide = windowState.on('hide', function (event, eventType) {
      alert('No, please look at me!')
    })

    windowState.on('show', function (event, eventType) {
      alert('Oh, you left? I had not noticed.')
      deregisterHide()
    })

    $scope.$on('windowBlur', function (event, eventType) {
      alert('Pay attention; I need your focus.')
    })
  })
```

## Quick Guide

### Installation

``` bash
$ npm install angular-window-events
```

Or download from [master/release](https://github.com/shaungrady/angular-window-events/tree/master/release)



### Event Handling

#### windowState Service

##### Methods
``` javascript
.controller('myCtrl', function (windowState) {
  function eventHandler (event, eventType) {
    // Do things
  }

  windowState.on('focus', eventHandler)
  // Returns deregistration function. Calling it is the same as...
  windowState.off('focus', eventHandler)
  // Or, to remove all handlers for an eventType...
  windowState.off('focus')

  // Multiple event types can also be passed at once
  windowState.on('blue focus hide show', eventHandler)
  // As with the `off` method
  windowState.off('blue focus hide show', eventHandler)
})
```

##### Properties

``` javascript
windowState.hasVisibilitySupport // => boolean
windowState.isShowing // => boolean
windowState.isHidden // => boolean
windowState.isFocused // => boolean
windowState.isBlurred // => boolean
```


#### $scope.$on

You can also use the `$scope.$on` method to attach event handlers. When using
`$scope.$on`, the window events are broadcast under the following names:

* `windowBlur`
* `windowFocus`
* `windowHide`
* `windowShow`

``` javascript
$scope.$on('windowHide', function (event, eventType) {
  // Do things
})
```
