import angular from 'angular'

export default windowStateService

windowStateService.$inject = ['$rootScope', '$window']
function windowStateService ($rootScope, $window) {
  const supportedEvents = ['focus', 'blur', 'show', 'hide']

  const win = angular.element($window)
  const doc = win[0].document

  const handlersByEvent = {}
  let hasVisibilitySupport = false
  let isVisible
  let isFocused = doc.hasFocus()
  let hiddenProperty
  let vendorPrefix
  let prevEvent

  supportedEvents.forEach(eventType => { handlersByEvent[eventType] = [] })

  /**
   * Event Handling
   */

  function on (eventType, handler) {
    if (supportedEvents.indexOf(eventType) === -1) throw new Error('Unsupported window event type')
    handlersByEvent[eventType].push(handler)
    return off.bind({}, eventType, handler)
  }

  function off (eventType, handler) {
    if (supportedEvents.indexOf(eventType) === -1) throw new Error('Unsupported window event type')
    const handlers = handlersByEvent[eventType]
    // Remove all handlers
    if (!handler) handlersByEvent[eventType] = []
    // Remove specific handler
    else {
      const handlerIndex = handlers.indexOf(handler)
      if (handlerIndex > -1) handlers.splice(handlerIndex, 1)
    }
  }

  function trigger (eventType, event) {
    const eventName = 'window' + eventType[0].toUpperCase() + eventType.substr(1)
    const handlers = handlersByEvent[eventType]
    $rootScope.$broadcast(eventName, event, eventType)
    handlers.forEach(handler => handler.call({}, event, eventType))
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
    hasVisibilitySupport = true
    updatePageVisibility()
    doc.addEventListener(vendorPrefix + 'visibilitychange', updatePageVisibility)
  }

  function updatePageVisibility (event) {
    const isHidden = doc[hiddenProperty]
    const eventType = isHidden ? 'hide' : 'show'
    isVisible = eventType === 'show'
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
      isFocused = eventType === 'focus'
      trigger(eventType, event)
    })
  })

  return Object.freeze({
    get hasVisibilitySupport () { return hasVisibilitySupport },
    get isVisible () { return isVisible },
    get isHidden () { return !isVisible },
    get isFocused () { return isFocused },
    get isBlurred () { return !isFocused },
    on,
    off
  })
}
