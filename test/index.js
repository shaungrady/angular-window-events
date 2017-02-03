/* global angular, inject */

var simulant = require('simulant')

describe('window-events', function () {
  'use strict'

  var windowState
  var $rootScope

  beforeEach(angular.mock.module('window-events'))
  beforeEach(inject(function (_windowState_, _$rootScope_) {
    windowState = _windowState_
    $rootScope = _$rootScope_
  }))

  it('should exist', function () {
    expect(windowState).toBeDefined()
  })

  it('should have default properties', function () {
    expect(windowState.hasVisibilitySupport).toBe(true)
    expect(windowState.isShowing).toBe(true)
    expect(windowState.isHidden).toBe(false)
    expect(windowState.isFocused).toBe(false)
    expect(windowState.isBlurred).toBe(true)
  })

  describe('`on` method', function () {
    var foo

    beforeEach(function () {
      foo = { bar: function () {} }
      spyOn(foo, 'bar')
    })

    it('"on" method should return an "off" function', function () {
      var off = windowState.on('hide', foo.bar)
      off()
      simulant.fire(window, 'visibilitychange')
      expect(foo.bar).toHaveBeenCalledTimes(0)
    })

    it('should support focus events', function () {
      windowState.on('focus', foo.bar)
      simulant.fire(window, 'focus')
      expect(foo.bar).toHaveBeenCalled()
    })

    it('should support blur events', function () {
      windowState.on('blur', foo.bar)
      simulant.fire(window, 'blur')
      expect(foo.bar).toHaveBeenCalled()
    })

    it('should support visibilitychange events', function () {
      windowState.on('show', foo.bar)
      simulant.fire(document, 'visibilitychange')
      expect(foo.bar).toHaveBeenCalled()
    })

    it('should update properties on the service object', function () {
      simulant.fire(window, 'focus')
      expect(windowState.isFocused).toBe(true)
      expect(windowState.isBlurred).toBe(false)
      simulant.fire(window, 'blur')
      expect(windowState.isFocused).toBe(false)
      expect(windowState.isBlurred).toBe(true)
    })

    it('should broadcast events', function () {
      $rootScope.$on('windowFocus', foo.bar)
      simulant.fire(window, 'focus')
      expect(foo.bar).toHaveBeenCalled()
    })
  })
})
