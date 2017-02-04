import angular from 'angular'

export default windowStateService

windowStateService.$inject = ['$rootScope', '$window']
function windowStateService ($rootScope, $window) {
  const supportedEvents = ['focus', 'blur', 'show', 'hide']

  const win = angular.element($window)
  const doc = win[0].document

  const handlersByEvent = {}
  let hasVisibilitySupport = false
  let isShowing
  let isFocused = doc.hasFocus()
  let hiddenProperty
  let vendorPrefix = ''
  let previousEvent

  supportedEvents.forEach(eventType => { handlersByEvent[eventType] = [] })

  /**
   * Event Handling
   */

  function on (eventType, handler) {
    const eventTypes = getEventTypes(eventType)
    if (!eventTypes.length) throw new Error(`Unsupported window event type "${eventType}".`)
    eventTypes.forEach(type => handlersByEvent[type].push(handler))
    return off.bind({}, eventType, handler)
  }

  function off (eventType, handler) {
    const eventTypes = getEventTypes(eventType)
    if (!eventTypes.length) throw new Error(`Unsupported window event type "${eventType}".`)
    eventTypes.forEach(type => {
      if (!handler) handlersByEvent[type] = []
      else {
        const handlers = handlersByEvent[type]
        const handlerIndex = handlers.indexOf(handler)
        if (handlerIndex > -1) handlers.splice(handlerIndex, 1)
      }
    })
  }

  function getEventTypes (eventType) {
    return eventType
      .split(' ')
      .filter(type => supportedEvents.indexOf(type) > -1)
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
    isShowing = eventType === 'show'
    if (event) trigger(eventType, event)
  }

  /**
   * Blur/Focus Event Listening
   */

  ;['blur', 'focus'].forEach(eventType => {
    // We'll let jQuery/jqLite handle cross-browser compatibility with window blur/focus
    // We have to track previous event to prevent event double-firing
    win.on(eventType, event => {
      if (previousEvent === eventType) return
      previousEvent = eventType
      isFocused = eventType === 'focus'
      trigger(eventType, event)
    })
  })

  return Object.freeze({
    // Properties
    hasVisibilitySupport,
    get isShowing () { return isShowing },
    get isHidden () { return !isShowing },
    get isFocused () { return isFocused },
    get isBlurred () { return !isFocused },
    // Methods
    on,
    off
  })
}
