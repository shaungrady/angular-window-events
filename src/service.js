import angular from 'angular'

export default windowStateService

windowStateService.$inject = ['$rootScope', '$window']
function windowStateService ($rootScope, $window) {
  const api = {}
  const supportedEvents = ['focus', 'blur', 'show', 'hide']

  const win = angular.element($window)
  const doc = win[0].document

  const handlersByEvent = {}
  let hiddenProperty
  let vendorPrefix
  let prevEvent

  api.hasVisibilitySupport = false
  api.isFocused = doc.hasFocus()
  api.isBlurred = !api.isFocused

  supportedEvents.forEach(eventType => { handlersByEvent[eventType] = [] })

  /**
   * Event Handling
   */

  api.on = function on (eventType, handler) {
    if (supportedEvents.indexOf(eventType) === -1) throw new Error('Unsupported window event type')
    handlersByEvent[eventType].push(handler)
    return api
  }

  api.off = function on (eventType, handler) {
    if (supportedEvents.indexOf(eventType) === -1) throw new Error('Unsupported window event type')
    var handlers = handlersByEvent[eventType]
    // Remove all handlers
    if (!handler) handlersByEvent[eventType] = []
    // Remove specific handler
    else {
      var handlerIndex = handlers.indexOf(handler)
      if (handlerIndex > -1) handlers.splice(handlerIndex, 1)
    }
    return api
  }

  function trigger (eventType, event) {
    const eventName = 'window' + eventType[0].toUpperCase() + eventType.substr(1)
    const handlers = handlersByEvent[eventType]
    $rootScope.$broadcast(eventName, event, eventType)
    handlers.forEach(handler => handler.call(api, event, eventType))
  }

  /**
   * Page Visibility (Hide/Show Event Listening)
   */

  // Determine vendor prefix requirement for Page Visibility API
  if ('hidden' in doc) hiddenProperty = 'hidden'
  else {
    ;['moz', 'webkit'].forEach(prefix => {
      if (prefix + 'Hidden' in doc) {
        hiddenProperty = prefix + 'Hidden'
        vendorPrefix = prefix
      }
    })
  }

  // Support for Page Visibility API?
  if (hiddenProperty) {
    api.hasVisibilitySupport = true
    updatePageVisibility()
    doc.addEventListener(vendorPrefix + 'visibilitychange', updatePageVisibility)
  }

  function updatePageVisibility (event) {
    const isHidden = doc[hiddenProperty]
    const eventType = isHidden ? 'hide' : 'show'
    api.isHidden = eventType === 'hide'
    api.isVisible = eventType === 'show'
    trigger(eventType, event)
  }

  /**
   * Blur/Focus Event Listening
   */

  ;['blur', 'focus'].forEach(eventType => {
    // We'll let jQuery/jqLite handle cross-browser compatibility with window blur/focus
    // We have to track previous event to prevent event double-firing
    win.on(eventType, event => {
      if (prevEvent === eventType) return
      prevEvent = eventType
      api.isBlurred = eventType === 'blur'
      api.isFocused = eventType === 'focus'
      trigger(eventType, event)
    })
  })

  return api
}
