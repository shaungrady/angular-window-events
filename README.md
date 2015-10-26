angular-window-events
=====================
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)
[![npm version](https://badge.fury.io/js/angular-window-events.svg)](https://badge.fury.io/js/angular-window-events)

An AngularJS module to add $broadcasts of window blur, focus, hide, and show events.

## Usage
### Requirements
* **AngularJS v1.0.0+**
	* **1.2.7+** is recommended due to an optimization in `$scope` `$broadcast` propagation.

### Installation
``` bash
# use npm
$ npm install angular-window-events
# or bower
$ bower install angular-window-events
# or grab what you want from /release
```

### Event Listening
Window events are broadcast from the `$rootScope` with the browser event passed as an argument. To listen for an event, follow AngularJS' documentation for the `$on` method of `$scope` here: http://docs.angularjs.org/api/ng.$rootScope.Scope#methods_$on

#### Events
The event names broadcast by this module are as follows:
* `windowBlur`
* `windowFocus`
* `windowHide`*
* `windowShow`*

For details on what triggers `windowHide` and `windowShow`, read the W3C *Page Visibility* spec: http://www.w3.org/TR/page-visibility/

\* *Compatibility: Internet Explorer 10+, Firefox 10+, Chrome 14+, Safari 6.1+, Opera 12.1+, iOS Safari 7+, Android 4.4+. For more details visit* http://caniuse.com/#feat=pagevisibility

#### Example
```javascript
angular
	.module('myApp', ['window-events'])
	.controller('myCtrl', ['$scope', function($scope) {

	  $scope.$on('windowFocus', function(broadcastEvent, browserEvent) {
	    // Something useful, like refreshing stale data, perhaps?
	  })

	}])
```
