var globalThis = this;
var global = this;
function __skpm_run (key, context) {
  globalThis.context = context;
  try {

var exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/render.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/@skpm/promise/index.js":
/*!*********************************************!*\
  !*** ./node_modules/@skpm/promise/index.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/* from https://github.com/taylorhakes/promise-polyfill */

function promiseFinally(callback) {
  var constructor = this.constructor;
  return this.then(
    function(value) {
      return constructor.resolve(callback()).then(function() {
        return value;
      });
    },
    function(reason) {
      return constructor.resolve(callback()).then(function() {
        return constructor.reject(reason);
      });
    }
  );
}

function noop() {}

/**
 * @constructor
 * @param {Function} fn
 */
function Promise(fn) {
  if (!(this instanceof Promise))
    throw new TypeError("Promises must be constructed via new");
  if (typeof fn !== "function") throw new TypeError("not a function");
  /** @type {!number} */
  this._state = 0;
  /** @type {!boolean} */
  this._handled = false;
  /** @type {Promise|undefined} */
  this._value = undefined;
  /** @type {!Array<!Function>} */
  this._deferreds = [];

  doResolve(fn, this);
}

function handle(self, deferred) {
  while (self._state === 3) {
    self = self._value;
  }
  if (self._state === 0) {
    self._deferreds.push(deferred);
    return;
  }
  self._handled = true;
  Promise._immediateFn(function() {
    var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;
    if (cb === null) {
      (self._state === 1 ? resolve : reject)(deferred.promise, self._value);
      return;
    }
    var ret;
    try {
      ret = cb(self._value);
    } catch (e) {
      reject(deferred.promise, e);
      return;
    }
    resolve(deferred.promise, ret);
  });
}

function resolve(self, newValue) {
  try {
    // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
    if (newValue === self)
      throw new TypeError("A promise cannot be resolved with itself.");
    if (
      newValue &&
      (typeof newValue === "object" || typeof newValue === "function")
    ) {
      var then = newValue.then;
      if (newValue instanceof Promise) {
        self._state = 3;
        self._value = newValue;
        finale(self);
        return;
      } else if (typeof then === "function") {
        doResolve(then.bind(newValue), self);
        return;
      }
    }
    self._state = 1;
    self._value = newValue;
    finale(self);
  } catch (e) {
    reject(self, e);
  }
}

function reject(self, newValue) {
  self._state = 2;
  self._value = newValue;
  finale(self);
}

function finale(self) {
  if (self._state === 2 && self._deferreds.length === 0) {
    Promise._immediateFn(function() {
      if (!self._handled) {
        Promise._unhandledRejectionFn(self._value, self);
      }
    });
  }

  for (var i = 0, len = self._deferreds.length; i < len; i++) {
    handle(self, self._deferreds[i]);
  }
  self._deferreds = null;
}

/**
 * @constructor
 */
function Handler(onFulfilled, onRejected, promise) {
  this.onFulfilled = typeof onFulfilled === "function" ? onFulfilled : null;
  this.onRejected = typeof onRejected === "function" ? onRejected : null;
  this.promise = promise;
}

/**
 * Take a potentially misbehaving resolver function and make sure
 * onFulfilled and onRejected are only called once.
 *
 * Makes no guarantees about asynchrony.
 */
function doResolve(fn, self) {
  var done = false;
  try {
    fn(
      function(value) {
        if (done) {
          Promise._multipleResolvesFn("resolve", self, value);
          return;
        }
        done = true;
        resolve(self, value);
      },
      function(reason) {
        if (done) {
          Promise._multipleResolvesFn("reject", self, reason);
          return;
        }
        done = true;
        reject(self, reason);
      }
    );
  } catch (ex) {
    if (done) {
      Promise._multipleResolvesFn("reject", self, ex);
      return;
    }
    done = true;
    reject(self, ex);
  }
}

Promise.prototype["catch"] = function(onRejected) {
  return this.then(null, onRejected);
};

Promise.prototype.then = function(onFulfilled, onRejected) {
  // @ts-ignore
  var prom = new this.constructor(noop);

  handle(this, new Handler(onFulfilled, onRejected, prom));
  return prom;
};

Promise.prototype["finally"] = promiseFinally;

Promise.all = function(arr) {
  return new Promise(function(resolve, reject) {
    if (!Array.isArray(arr)) {
      return reject(new TypeError("Promise.all accepts an array"));
    }

    var args = Array.prototype.slice.call(arr);
    if (args.length === 0) return resolve([]);
    var remaining = args.length;

    function res(i, val) {
      try {
        if (val && (typeof val === "object" || typeof val === "function")) {
          var then = val.then;
          if (typeof then === "function") {
            then.call(
              val,
              function(val) {
                res(i, val);
              },
              reject
            );
            return;
          }
        }
        args[i] = val;
        if (--remaining === 0) {
          resolve(args);
        }
      } catch (ex) {
        reject(ex);
      }
    }

    for (var i = 0; i < args.length; i++) {
      res(i, args[i]);
    }
  });
};

Promise.resolve = function(value) {
  if (value && typeof value === "object" && value.constructor === Promise) {
    return value;
  }

  return new Promise(function(resolve) {
    resolve(value);
  });
};

Promise.reject = function(value) {
  return new Promise(function(resolve, reject) {
    reject(value);
  });
};

Promise.race = function(arr) {
  return new Promise(function(resolve, reject) {
    if (!Array.isArray(arr)) {
      return reject(new TypeError("Promise.race accepts an array"));
    }

    for (var i = 0, len = arr.length; i < len; i++) {
      Promise.resolve(arr[i]).then(resolve, reject);
    }
  });
};

// Use polyfill for setImmediate for performance gains
Promise._immediateFn = setImmediate;

Promise._unhandledRejectionFn = function _unhandledRejectionFn(err, promise) {
  if (
    typeof process !== "undefined" &&
    process.listenerCount &&
    (process.listenerCount("unhandledRejection") ||
      process.listenerCount("uncaughtException"))
  ) {
    process.emit("unhandledRejection", err, promise);
    process.emit("uncaughtException", err, "unhandledRejection");
  } else if (typeof console !== "undefined" && console) {
    console.warn("Possible Unhandled Promise Rejection:", err);
  }
};

Promise._multipleResolvesFn = function _multipleResolvesFn(
  type,
  promise,
  value
) {
  if (typeof process !== "undefined" && process.emit) {
    process.emit("multipleResolves", type, promise, value);
  }
};

module.exports = Promise;


/***/ }),

/***/ "./node_modules/mocha-js-delegate/index.js":
/*!*************************************************!*\
  !*** ./node_modules/mocha-js-delegate/index.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/* globals MOClassDescription, NSObject, NSSelectorFromString, NSClassFromString, MOPropertyDescription */

module.exports = function MochaDelegate(definition, superclass) {
  var uniqueClassName =
    'MochaJSDelegate_DynamicClass_' + NSUUID.UUID().UUIDString()

  var delegateClassDesc = MOClassDescription.allocateDescriptionForClassWithName_superclass_(
    uniqueClassName,
    superclass || NSObject
  )

  // Storage
  var handlers = {}
  var ivars = {}

  // Define an instance method
  function setHandlerForSelector(selectorString, func) {
    var handlerHasBeenSet = selectorString in handlers
    var selector = NSSelectorFromString(selectorString)

    handlers[selectorString] = func

    /*
      For some reason, Mocha acts weird about arguments: https://github.com/logancollins/Mocha/issues/28
      We have to basically create a dynamic handler with a likewise dynamic number of predefined arguments.
    */
    if (!handlerHasBeenSet) {
      var args = []
      var regex = /:/g
      while (regex.exec(selectorString)) {
        args.push('arg' + args.length)
      }

      // eslint-disable-next-line no-eval
      var dynamicFunction = eval(
        '(function (' +
          args.join(', ') +
          ') { return handlers[selectorString].apply(this, arguments); })'
      )

      delegateClassDesc.addInstanceMethodWithSelector_function(
        selector,
        dynamicFunction
      )
    }
  }

  // define a property
  function setIvar(key, value) {
    var ivarHasBeenSet = key in handlers

    ivars[key] = value

    if (!ivarHasBeenSet) {
      delegateClassDesc.addInstanceVariableWithName_typeEncoding(key, '@')
      var description = MOPropertyDescription.new()
      description.name = key
      description.typeEncoding = '@'
      description.weak = true
      description.ivarName = key
      delegateClassDesc.addProperty(description)
    }
  }

  this.getClass = function() {
    return NSClassFromString(uniqueClassName)
  }

  this.getClassInstance = function(instanceVariables) {
    var instance = NSClassFromString(uniqueClassName).new()
    Object.keys(ivars).forEach(function(key) {
      instance[key] = ivars[key]
    })
    Object.keys(instanceVariables || {}).forEach(function(key) {
      instance[key] = instanceVariables[key]
    })
    return instance
  }
  // alias
  this.new = this.getClassInstance

  // Convenience
  if (typeof definition === 'object') {
    Object.keys(definition).forEach(
      function(key) {
        if (typeof definition[key] === 'function') {
          setHandlerForSelector(key, definition[key])
        } else {
          setIvar(key, definition[key])
        }
      }
    )
  }

  delegateClassDesc.registerClass()
}


/***/ }),

/***/ "./node_modules/sketch-module-web-view/lib/browser-api.js":
/*!****************************************************************!*\
  !*** ./node_modules/sketch-module-web-view/lib/browser-api.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function parseHexColor(color) {
  // Check the string for incorrect formatting.
  if (!color || color[0] !== '#') {
    if (
      color &&
      typeof color.isKindOfClass === 'function' &&
      color.isKindOfClass(NSColor)
    ) {
      return color
    }
    throw new Error(
      'Incorrect color formating. It should be an hex color: #RRGGBBAA'
    )
  }

  // append FF if alpha channel is not specified.
  var source = color.substr(1)
  if (source.length === 3) {
    source += 'F'
  } else if (source.length === 6) {
    source += 'FF'
  }
  // Convert the string from #FFF format to #FFFFFF format.
  var hex
  if (source.length === 4) {
    for (var i = 0; i < 4; i += 1) {
      hex += source[i]
      hex += source[i]
    }
  } else if (source.length === 8) {
    hex = source
  } else {
    return NSColor.whiteColor()
  }

  var r = parseInt(hex.slice(0, 2), 16)
  var g = parseInt(hex.slice(2, 4), 16)
  var b = parseInt(hex.slice(4, 6), 16)
  var a = parseInt(hex.slice(6, 8), 16)

  return NSColor.colorWithSRGBRed_green_blue_alpha(r, g, b, a)
}

module.exports = function(browserWindow, panel, webview) {
  // keep reference to the subviews
  browserWindow._panel = panel
  browserWindow._webview = webview
  browserWindow._destroyed = false

  browserWindow.destroy = function() {
    return panel.close()
  }

  browserWindow.close = function() {
    if (panel.delegate().utils && panel.delegate().utils.parentWindow) {
      var shouldClose = true
      browserWindow.emit('close', {
        get defaultPrevented() {
          return !shouldClose
        },
        preventDefault: function() {
          shouldClose = false
        },
      })
      if (shouldClose) {
        panel.delegate().utils.parentWindow.endSheet(panel)
      }
      return
    }

    if (!browserWindow.isClosable()) {
      return
    }

    panel.performClose(null)
  }

  function focus(focused) {
    if (!browserWindow.isVisible()) {
      return
    }
    if (focused) {
      NSApplication.sharedApplication().activateIgnoringOtherApps(true)
      panel.makeKeyAndOrderFront(null)
    } else {
      panel.orderBack(null)
      NSApp.mainWindow().makeKeyAndOrderFront(null)
    }
  }

  browserWindow.focus = focus.bind(this, true)
  browserWindow.blur = focus.bind(this, false)

  browserWindow.isFocused = function() {
    return panel.isKeyWindow()
  }

  browserWindow.isDestroyed = function() {
    return browserWindow._destroyed
  }

  browserWindow.show = function() {
    // This method is supposed to put focus on window, however if the app does not
    // have focus then "makeKeyAndOrderFront" will only show the window.
    NSApp.activateIgnoringOtherApps(true)

    if (panel.delegate().utils && panel.delegate().utils.parentWindow) {
      return panel.delegate().utils.parentWindow.beginSheet_completionHandler(
        panel,
        __mocha__.createBlock_function('v16@?0q8', function() {
          browserWindow.emit('closed')
        })
      )
    }

    return panel.makeKeyAndOrderFront(null)
  }

  browserWindow.showInactive = function() {
    return panel.orderFrontRegardless()
  }

  browserWindow.hide = function() {
    return panel.orderOut(null)
  }

  browserWindow.isVisible = function() {
    return panel.isVisible()
  }

  browserWindow.isModal = function() {
    return false
  }

  browserWindow.maximize = function() {
    if (!browserWindow.isMaximized()) {
      panel.zoom(null)
    }
  }
  browserWindow.unmaximize = function() {
    if (browserWindow.isMaximized()) {
      panel.zoom(null)
    }
  }

  browserWindow.isMaximized = function() {
    if ((panel.styleMask() & NSResizableWindowMask) !== 0) {
      return panel.isZoomed()
    }
    var rectScreen = NSScreen.mainScreen().visibleFrame()
    var rectWindow = panel.frame()
    return (
      rectScreen.origin.x == rectWindow.origin.x &&
      rectScreen.origin.y == rectWindow.origin.y &&
      rectScreen.size.width == rectWindow.size.width &&
      rectScreen.size.height == rectWindow.size.height
    )
  }

  browserWindow.minimize = function() {
    return panel.miniaturize(null)
  }

  browserWindow.restore = function() {
    return panel.deminiaturize(null)
  }

  browserWindow.isMinimized = function() {
    return panel.isMiniaturized()
  }

  browserWindow.setFullScreen = function(fullscreen) {
    if (fullscreen !== browserWindow.isFullscreen()) {
      panel.toggleFullScreen(null)
    }
  }

  browserWindow.isFullscreen = function() {
    return panel.styleMask() & NSFullScreenWindowMask
  }

  browserWindow.setAspectRatio = function(aspectRatio /* , extraSize */) {
    // Reset the behaviour to default if aspect_ratio is set to 0 or less.
    if (aspectRatio > 0.0) {
      panel.setAspectRatio(NSMakeSize(aspectRatio, 1.0))
    } else {
      panel.setResizeIncrements(NSMakeSize(1.0, 1.0))
    }
  }

  browserWindow.setBounds = function(bounds, animate) {
    if (!bounds) {
      return
    }

    // Do nothing if in fullscreen mode.
    if (browserWindow.isFullscreen()) {
      return
    }

    const newBounds = Object.assign(browserWindow.getBounds(), bounds)

    // TODO: Check size constraints since setFrame does not check it.
    // var size = bounds.size
    // size.SetToMax(GetMinimumSize());
    // gfx::Size max_size = GetMaximumSize();
    // if (!max_size.IsEmpty())
    //   size.SetToMin(max_size);

    var cocoaBounds = NSMakeRect(
      newBounds.x,
      0,
      newBounds.width,
      newBounds.height
    )
    // Flip Y coordinates based on the primary screen
    var screen = NSScreen.screens().firstObject()
    cocoaBounds.origin.y = NSHeight(screen.frame()) - newBounds.y

    panel.setFrame_display_animate(cocoaBounds, true, animate)
  }

  browserWindow.getBounds = function() {
    const cocoaBounds = panel.frame()
    var mainScreenRect = NSScreen.screens()
      .firstObject()
      .frame()
    return {
      x: cocoaBounds.origin.x,
      y: Math.round(NSHeight(mainScreenRect) - cocoaBounds.origin.y),
      width: cocoaBounds.size.width,
      height: cocoaBounds.size.height,
    }
  }

  browserWindow.setContentBounds = function(bounds, animate) {
    // TODO:
    browserWindow.setBounds(bounds, animate)
  }

  browserWindow.getContentBounds = function() {
    // TODO:
    return browserWindow.getBounds()
  }

  browserWindow.setSize = function(width, height, animate) {
    // TODO: handle resizing around center
    return browserWindow.setBounds({ width: width, height: height }, animate)
  }

  browserWindow.getSize = function() {
    var bounds = browserWindow.getBounds()
    return [bounds.width, bounds.height]
  }

  browserWindow.setContentSize = function(width, height, animate) {
    // TODO: handle resizing around center
    return browserWindow.setContentBounds(
      { width: width, height: height },
      animate
    )
  }

  browserWindow.getContentSize = function() {
    var bounds = browserWindow.getContentBounds()
    return [bounds.width, bounds.height]
  }

  browserWindow.setMinimumSize = function(width, height) {
    const minSize = CGSizeMake(width, height)
    panel.setContentMinSize(minSize)
  }

  browserWindow.getMinimumSize = function() {
    const size = panel.contentMinSize()
    return [size.width, size.height]
  }

  browserWindow.setMaximumSize = function(width, height) {
    const maxSize = CGSizeMake(width, height)
    panel.setContentMaxSize(maxSize)
  }

  browserWindow.getMaximumSize = function() {
    const size = panel.contentMaxSize()
    return [size.width, size.height]
  }

  browserWindow.setResizable = function(resizable) {
    return browserWindow._setStyleMask(resizable, NSResizableWindowMask)
  }

  browserWindow.isResizable = function() {
    return panel.styleMask() & NSResizableWindowMask
  }

  browserWindow.setMovable = function(movable) {
    return panel.setMovable(movable)
  }
  browserWindow.isMovable = function() {
    return panel.isMovable()
  }

  browserWindow.setMinimizable = function(minimizable) {
    return browserWindow._setStyleMask(minimizable, NSMiniaturizableWindowMask)
  }

  browserWindow.isMinimizable = function() {
    return panel.styleMask() & NSMiniaturizableWindowMask
  }

  browserWindow.setMaximizable = function(maximizable) {
    if (panel.standardWindowButton(NSWindowZoomButton)) {
      panel.standardWindowButton(NSWindowZoomButton).setEnabled(maximizable)
    }
  }

  browserWindow.isMaximizable = function() {
    return (
      panel.standardWindowButton(NSWindowZoomButton) &&
      panel.standardWindowButton(NSWindowZoomButton).isEnabled()
    )
  }

  browserWindow.setFullScreenable = function(fullscreenable) {
    browserWindow._setCollectionBehavior(
      fullscreenable,
      NSWindowCollectionBehaviorFullScreenPrimary
    )
    // On EL Capitan this flag is required to hide fullscreen button.
    browserWindow._setCollectionBehavior(
      !fullscreenable,
      NSWindowCollectionBehaviorFullScreenAuxiliary
    )
  }

  browserWindow.isFullScreenable = function() {
    var collectionBehavior = panel.collectionBehavior()
    return collectionBehavior & NSWindowCollectionBehaviorFullScreenPrimary
  }

  browserWindow.setClosable = function(closable) {
    browserWindow._setStyleMask(closable, NSClosableWindowMask)
  }

  browserWindow.isClosable = function() {
    return panel.styleMask() & NSClosableWindowMask
  }

  browserWindow.setAlwaysOnTop = function(top, level, relativeLevel) {
    var windowLevel = NSNormalWindowLevel
    var maxWindowLevel = CGWindowLevelForKey(kCGMaximumWindowLevelKey)
    var minWindowLevel = CGWindowLevelForKey(kCGMinimumWindowLevelKey)

    if (top) {
      if (level === 'normal') {
        windowLevel = NSNormalWindowLevel
      } else if (level === 'torn-off-menu') {
        windowLevel = NSTornOffMenuWindowLevel
      } else if (level === 'modal-panel') {
        windowLevel = NSModalPanelWindowLevel
      } else if (level === 'main-menu') {
        windowLevel = NSMainMenuWindowLevel
      } else if (level === 'status') {
        windowLevel = NSStatusWindowLevel
      } else if (level === 'pop-up-menu') {
        windowLevel = NSPopUpMenuWindowLevel
      } else if (level === 'screen-saver') {
        windowLevel = NSScreenSaverWindowLevel
      } else if (level === 'dock') {
        // Deprecated by macOS, but kept for backwards compatibility
        windowLevel = NSDockWindowLevel
      } else {
        windowLevel = NSFloatingWindowLevel
      }
    }

    var newLevel = windowLevel + (relativeLevel || 0)
    if (newLevel >= minWindowLevel && newLevel <= maxWindowLevel) {
      panel.setLevel(newLevel)
    } else {
      throw new Error(
        'relativeLevel must be between ' +
          minWindowLevel +
          ' and ' +
          maxWindowLevel
      )
    }
  }

  browserWindow.isAlwaysOnTop = function() {
    return panel.level() !== NSNormalWindowLevel
  }

  browserWindow.moveTop = function() {
    return panel.orderFrontRegardless()
  }

  browserWindow.center = function() {
    panel.center()
  }

  browserWindow.setPosition = function(x, y, animate) {
    return browserWindow.setBounds({ x: x, y: y }, animate)
  }

  browserWindow.getPosition = function() {
    var bounds = browserWindow.getBounds()
    return [bounds.x, bounds.y]
  }

  browserWindow.setTitle = function(title) {
    panel.setTitle(title)
  }

  browserWindow.getTitle = function() {
    return String(panel.title())
  }

  var attentionRequestId = 0
  browserWindow.flashFrame = function(flash) {
    if (flash) {
      attentionRequestId = NSApp.requestUserAttention(NSInformationalRequest)
    } else {
      NSApp.cancelUserAttentionRequest(attentionRequestId)
      attentionRequestId = 0
    }
  }

  browserWindow.getNativeWindowHandle = function() {
    return panel
  }

  browserWindow.getNativeWebViewHandle = function() {
    return webview
  }

  browserWindow.loadURL = function(url) {
    // When frameLocation is a file, prefix it with the Sketch Resources path
    if (/^(?!https?|file).*\.html?$/.test(url)) {
      if (typeof __command !== 'undefined' && __command.pluginBundle()) {
        url =
          'file://' +
          __command
            .pluginBundle()
            .urlForResourceNamed(url)
            .path()
      }
    }

    if (/^file:\/\/.*\.html?$/.test(url)) {
      // ensure URLs containing spaces are properly handled
      url = NSString.alloc().initWithString(url)
      url = url.stringByAddingPercentEncodingWithAllowedCharacters(
        NSCharacterSet.URLQueryAllowedCharacterSet()
      )
      webview.loadFileURL_allowingReadAccessToURL(
        NSURL.URLWithString(url),
        NSURL.URLWithString('file:///')
      )
      return
    }

    const properURL = NSURL.URLWithString(url)
    const urlRequest = NSURLRequest.requestWithURL(properURL)

    webview.loadRequest(urlRequest)
  }

  browserWindow.reload = function() {
    webview.reload()
  }

  browserWindow.setHasShadow = function(hasShadow) {
    return panel.setHasShadow(hasShadow)
  }

  browserWindow.hasShadow = function() {
    return panel.hasShadow()
  }

  browserWindow.setOpacity = function(opacity) {
    return panel.setAlphaValue(opacity)
  }

  browserWindow.getOpacity = function() {
    return panel.alphaValue()
  }

  browserWindow.setVisibleOnAllWorkspaces = function(visible) {
    return browserWindow._setCollectionBehavior(
      visible,
      NSWindowCollectionBehaviorCanJoinAllSpaces
    )
  }

  browserWindow.isVisibleOnAllWorkspaces = function() {
    var collectionBehavior = panel.collectionBehavior()
    return collectionBehavior & NSWindowCollectionBehaviorCanJoinAllSpaces
  }

  browserWindow.setIgnoreMouseEvents = function(ignore) {
    return panel.setIgnoresMouseEvents(ignore)
  }

  browserWindow.setContentProtection = function(enable) {
    panel.setSharingType(enable ? NSWindowSharingNone : NSWindowSharingReadOnly)
  }

  browserWindow.setAutoHideCursor = function(autoHide) {
    panel.setDisableAutoHideCursor(autoHide)
  }

  browserWindow.setVibrancy = function(type) {
    var effectView = browserWindow._vibrantView

    if (!type) {
      if (effectView == null) {
        return
      }

      effectView.removeFromSuperview()
      panel.setVibrantView(null)
      return
    }

    if (effectView == null) {
      var contentView = panel.contentView()
      effectView = NSVisualEffectView.alloc().initWithFrame(
        contentView.bounds()
      )
      browserWindow._vibrantView = effectView

      effectView.setAutoresizingMask(NSViewWidthSizable | NSViewHeightSizable)
      effectView.setBlendingMode(NSVisualEffectBlendingModeBehindWindow)
      effectView.setState(NSVisualEffectStateActive)
      effectView.setFrame(contentView.bounds())
      contentView.addSubview_positioned_relativeTo(
        effectView,
        NSWindowBelow,
        null
      )
    }

    var vibrancyType = NSVisualEffectMaterialLight

    if (type === 'appearance-based') {
      vibrancyType = NSVisualEffectMaterialAppearanceBased
    } else if (type === 'light') {
      vibrancyType = NSVisualEffectMaterialLight
    } else if (type === 'dark') {
      vibrancyType = NSVisualEffectMaterialDark
    } else if (type === 'titlebar') {
      vibrancyType = NSVisualEffectMaterialTitlebar
    } else if (type === 'selection') {
      vibrancyType = NSVisualEffectMaterialSelection
    } else if (type === 'menu') {
      vibrancyType = NSVisualEffectMaterialMenu
    } else if (type === 'popover') {
      vibrancyType = NSVisualEffectMaterialPopover
    } else if (type === 'sidebar') {
      vibrancyType = NSVisualEffectMaterialSidebar
    } else if (type === 'medium-light') {
      vibrancyType = NSVisualEffectMaterialMediumLight
    } else if (type === 'ultra-dark') {
      vibrancyType = NSVisualEffectMaterialUltraDark
    }

    effectView.setMaterial(vibrancyType)
  }

  browserWindow._setBackgroundColor = function(colorName) {
    var color = parseHexColor(colorName)
    webview.setValue_forKey(false, 'drawsBackground')
    panel.backgroundColor = color
  }

  browserWindow._invalidate = function() {
    panel.flushWindow()
    panel.contentView().setNeedsDisplay(true)
  }

  browserWindow._setStyleMask = function(on, flag) {
    var wasMaximizable = browserWindow.isMaximizable()
    if (on) {
      panel.setStyleMask(panel.styleMask() | flag)
    } else {
      panel.setStyleMask(panel.styleMask() & ~flag)
    }
    // Change style mask will make the zoom button revert to default, probably
    // a bug of Cocoa or macOS.
    browserWindow.setMaximizable(wasMaximizable)
  }

  browserWindow._setCollectionBehavior = function(on, flag) {
    var wasMaximizable = browserWindow.isMaximizable()
    if (on) {
      panel.setCollectionBehavior(panel.collectionBehavior() | flag)
    } else {
      panel.setCollectionBehavior(panel.collectionBehavior() & ~flag)
    }
    // Change collectionBehavior will make the zoom button revert to default,
    // probably a bug of Cocoa or macOS.
    browserWindow.setMaximizable(wasMaximizable)
  }

  browserWindow._showWindowButton = function(button) {
    var view = panel.standardWindowButton(button)
    view.superview().addSubview_positioned_relative(view, NSWindowAbove, null)
  }
}


/***/ }),

/***/ "./node_modules/sketch-module-web-view/lib/constants.js":
/*!**************************************************************!*\
  !*** ./node_modules/sketch-module-web-view/lib/constants.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = {
  JS_BRIDGE: '__skpm_sketchBridge',
  JS_BRIDGE_RESULT_SUCCESS: '__skpm_sketchBridge_success',
  JS_BRIDGE_RESULT_ERROR: '__skpm_sketchBridge_error',
  START_MOVING_WINDOW: '__skpm_startMovingWindow',
  EXECUTE_JAVASCRIPT: '__skpm_executeJS',
  EXECUTE_JAVASCRIPT_SUCCESS: '__skpm_executeJS_success_',
  EXECUTE_JAVASCRIPT_ERROR: '__skpm_executeJS_error_',
}


/***/ }),

/***/ "./node_modules/sketch-module-web-view/lib/dispatch-first-click.js":
/*!*************************************************************************!*\
  !*** ./node_modules/sketch-module-web-view/lib/dispatch-first-click.js ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

var tagsToFocus =
  '["text", "textarea", "date", "datetime-local", "email", "number", "month", "password", "search", "tel", "time", "url", "week" ]'

module.exports = function(webView, event) {
  var point = webView.convertPoint_fromView(event.locationInWindow(), null)
  return (
    'var el = document.elementFromPoint(' + // get the DOM element that match the event
    point.x +
    ', ' +
    point.y +
    '); ' +
    'if (el && el.tagName === "SELECT") {' + // select needs special handling
    '  var event = document.createEvent("MouseEvents");' +
    '  event.initMouseEvent("mousedown", true, true, window);' +
    '  el.dispatchEvent(event);' +
    '} else if (el && ' + // some tags need to be focused instead of clicked
    tagsToFocus +
    '.indexOf(el.type) >= 0 && ' +
    'el.focus' +
    ') {' +
    'el.focus();' + // so focus them
    '} else if (el) {' +
    'el.dispatchEvent(new Event("click", {bubbles: true}))' + // click the others
    '}'
  )
}


/***/ }),

/***/ "./node_modules/sketch-module-web-view/lib/execute-javascript.js":
/*!***********************************************************************!*\
  !*** ./node_modules/sketch-module-web-view/lib/execute-javascript.js ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Promise) {var CONSTANTS = __webpack_require__(/*! ./constants */ "./node_modules/sketch-module-web-view/lib/constants.js")

module.exports = function(webview, browserWindow) {
  function executeJavaScript(script, userGesture, callback) {
    if (typeof userGesture === 'function') {
      callback = userGesture
      userGesture = false
    }
    var fiber = coscript.createFiber()

    // if the webview is not ready yet, defer the execution until it is
    if (
      webview.navigationDelegate().state &&
      webview.navigationDelegate().state.wasReady == 0
    ) {
      return new Promise(function(resolve, reject) {
        browserWindow.once('ready-to-show', function() {
          executeJavaScript(script, userGesture, callback)
            .then(resolve)
            .catch(reject)
          fiber.cleanup()
        })
      })
    }

    return new Promise(function(resolve, reject) {
      var requestId = Math.random()

      browserWindow.webContents.on(
        CONSTANTS.EXECUTE_JAVASCRIPT_SUCCESS + requestId,
        function(res) {
          try {
            if (callback) {
              callback(null, res)
            }
            resolve(res)
          } catch (err) {
            reject(err)
          }
          fiber.cleanup()
        }
      )
      browserWindow.webContents.on(
        CONSTANTS.EXECUTE_JAVASCRIPT_ERROR + requestId,
        function(err) {
          try {
            if (callback) {
              callback(err)
              resolve()
            } else {
              reject(err)
            }
          } catch (err2) {
            reject(err2)
          }
          fiber.cleanup()
        }
      )

      webview.evaluateJavaScript_completionHandler(
        module.exports.wrapScript(script, requestId),
        null
      )
    })
  }

  return executeJavaScript
}

module.exports.wrapScript = function(script, requestId) {
  return (
    'window.' +
    CONSTANTS.EXECUTE_JAVASCRIPT +
    '(' +
    requestId +
    ', ' +
    JSON.stringify(script) +
    ')'
  )
}

module.exports.injectScript = function(webView) {
  var source =
    'window.' +
    CONSTANTS.EXECUTE_JAVASCRIPT +
    ' = function(id, script) {' +
    '  try {' +
    '    var res = eval(script);' +
    '    if (res && typeof res.then === "function" && typeof res.catch === "function") {' +
    '      res.then(function (res2) {' +
    '        window.postMessage("' +
    CONSTANTS.EXECUTE_JAVASCRIPT_SUCCESS +
    '" + id, res2);' +
    '      })' +
    '      .catch(function (err) {' +
    '        window.postMessage("' +
    CONSTANTS.EXECUTE_JAVASCRIPT_ERROR +
    '" + id, err);' +
    '      })' +
    '    } else {' +
    '      window.postMessage("' +
    CONSTANTS.EXECUTE_JAVASCRIPT_SUCCESS +
    '" + id, res);' +
    '    }' +
    '  } catch (err) {' +
    '    window.postMessage("' +
    CONSTANTS.EXECUTE_JAVASCRIPT_ERROR +
    '" + id, err);' +
    '  }' +
    '}'
  var script = WKUserScript.alloc().initWithSource_injectionTime_forMainFrameOnly(
    source,
    0,
    true
  )
  webView
    .configuration()
    .userContentController()
    .addUserScript(script)
}

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@skpm/promise/index.js */ "./node_modules/@skpm/promise/index.js")))

/***/ }),

/***/ "./node_modules/sketch-module-web-view/lib/fitSubview.js":
/*!***************************************************************!*\
  !*** ./node_modules/sketch-module-web-view/lib/fitSubview.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function addEdgeConstraint(edge, subview, view, constant) {
  view.addConstraint(
    NSLayoutConstraint.constraintWithItem_attribute_relatedBy_toItem_attribute_multiplier_constant(
      subview,
      edge,
      NSLayoutRelationEqual,
      view,
      edge,
      1,
      constant
    )
  )
}
module.exports = function fitSubviewToView(subview, view, constants) {
  constants = constants || []
  subview.setTranslatesAutoresizingMaskIntoConstraints(false)

  addEdgeConstraint(NSLayoutAttributeLeft, subview, view, constants[0] || 0)
  addEdgeConstraint(NSLayoutAttributeTop, subview, view, constants[1] || 0)
  addEdgeConstraint(NSLayoutAttributeRight, subview, view, constants[2] || 0)
  addEdgeConstraint(NSLayoutAttributeBottom, subview, view, constants[3] || 0)
}


/***/ }),

/***/ "./node_modules/sketch-module-web-view/lib/index.js":
/*!**********************************************************!*\
  !*** ./node_modules/sketch-module-web-view/lib/index.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* let's try to match the API from Electron's Browser window
(https://github.com/electron/electron/blob/master/docs/api/browser-window.md) */
var EventEmitter = __webpack_require__(/*! events */ "events")
var buildBrowserAPI = __webpack_require__(/*! ./browser-api */ "./node_modules/sketch-module-web-view/lib/browser-api.js")
var buildWebAPI = __webpack_require__(/*! ./webview-api */ "./node_modules/sketch-module-web-view/lib/webview-api.js")
var fitSubviewToView = __webpack_require__(/*! ./fitSubview */ "./node_modules/sketch-module-web-view/lib/fitSubview.js")
var dispatchFirstClick = __webpack_require__(/*! ./dispatch-first-click */ "./node_modules/sketch-module-web-view/lib/dispatch-first-click.js")
var injectClientMessaging = __webpack_require__(/*! ./inject-client-messaging */ "./node_modules/sketch-module-web-view/lib/inject-client-messaging.js")
var movableArea = __webpack_require__(/*! ./movable-area */ "./node_modules/sketch-module-web-view/lib/movable-area.js")
var executeJavaScript = __webpack_require__(/*! ./execute-javascript */ "./node_modules/sketch-module-web-view/lib/execute-javascript.js")
var setDelegates = __webpack_require__(/*! ./set-delegates */ "./node_modules/sketch-module-web-view/lib/set-delegates.js")

function BrowserWindow(options) {
  options = options || {}

  var identifier = options.identifier || NSUUID.UUID().UUIDString()
  var threadDictionary = NSThread.mainThread().threadDictionary()

  var existingBrowserWindow = BrowserWindow.fromId(identifier)

  // if we already have a window opened, reuse it
  if (existingBrowserWindow) {
    return existingBrowserWindow
  }

  var browserWindow = new EventEmitter()
  browserWindow.id = identifier

  if (options.modal && !options.parent) {
    throw new Error('A modal needs to have a parent.')
  }

  // Long-running script
  var fiber = coscript.createFiber()

  // Window size
  var width = options.width || 800
  var height = options.height || 600
  var mainScreenRect = NSScreen.screens()
    .firstObject()
    .frame()
  var cocoaBounds = NSMakeRect(
    typeof options.x !== 'undefined'
      ? options.x
      : Math.round((NSWidth(mainScreenRect) - width) / 2),
    typeof options.y !== 'undefined'
      ? NSHeight(mainScreenRect) - options.y
      : Math.round((NSHeight(mainScreenRect) - height) / 2),
    width,
    height
  )

  if (options.titleBarStyle && options.titleBarStyle !== 'default') {
    options.frame = false
  }

  var useStandardWindow = options.windowType !== 'textured'
  var styleMask = NSTitledWindowMask

  // this is commented out because the toolbar doesn't appear otherwise :thinking-face:
  // if (!useStandardWindow || options.frame === false) {
  //   styleMask = NSFullSizeContentViewWindowMask
  // }
  if (options.minimizable !== false) {
    styleMask |= NSMiniaturizableWindowMask
  }
  if (options.closable !== false) {
    styleMask |= NSClosableWindowMask
  }
  if (options.resizable !== false) {
    styleMask |= NSResizableWindowMask
  }
  if (!useStandardWindow || options.transparent || options.frame === false) {
    styleMask |= NSTexturedBackgroundWindowMask
  }

  var panel = NSPanel.alloc().initWithContentRect_styleMask_backing_defer(
    cocoaBounds,
    styleMask,
    NSBackingStoreBuffered,
    true
  )

  var wkwebviewConfig = WKWebViewConfiguration.alloc().init()
  var webView = WKWebView.alloc().initWithFrame_configuration(
    CGRectMake(0, 0, options.width || 800, options.height || 600),
    wkwebviewConfig
  )
  injectClientMessaging(webView)
  webView.setAutoresizingMask(NSViewWidthSizable | NSViewHeightSizable)

  buildBrowserAPI(browserWindow, panel, webView)
  buildWebAPI(browserWindow, panel, webView)
  setDelegates(browserWindow, panel, webView, options)

  if (options.windowType === 'desktop') {
    panel.setLevel(kCGDesktopWindowLevel - 1)
    // panel.setCanBecomeKeyWindow(false)
    panel.setCollectionBehavior(
      NSWindowCollectionBehaviorCanJoinAllSpaces |
        NSWindowCollectionBehaviorStationary |
        NSWindowCollectionBehaviorIgnoresCycle
    )
  }

  if (
    typeof options.minWidth !== 'undefined' ||
    typeof options.minHeight !== 'undefined'
  ) {
    browserWindow.setMinimumSize(options.minWidth || 0, options.minHeight || 0)
  }

  if (
    typeof options.maxWidth !== 'undefined' ||
    typeof options.maxHeight !== 'undefined'
  ) {
    browserWindow.setMaximumSize(
      options.maxWidth || 10000,
      options.maxHeight || 10000
    )
  }

  // if (options.focusable === false) {
  //   panel.setCanBecomeKeyWindow(false)
  // }

  if (options.transparent || options.frame === false) {
    panel.titlebarAppearsTransparent = true
    panel.titleVisibility = NSWindowTitleHidden
    panel.setOpaque(0)
    panel.isMovableByWindowBackground = true
    var toolbar2 = NSToolbar.alloc().initWithIdentifier(
      'titlebarStylingToolbar'
    )
    toolbar2.setShowsBaselineSeparator(false)
    panel.setToolbar(toolbar2)
  }

  if (options.titleBarStyle === 'hiddenInset') {
    var toolbar = NSToolbar.alloc().initWithIdentifier('titlebarStylingToolbar')
    toolbar.setShowsBaselineSeparator(false)
    panel.setToolbar(toolbar)
  }

  if (options.frame === false || !options.useContentSize) {
    browserWindow.setSize(width, height)
  }

  if (options.center) {
    browserWindow.center()
  }

  if (options.alwaysOnTop) {
    browserWindow.setAlwaysOnTop(true)
  }

  if (options.fullscreen) {
    browserWindow.setFullScreen(true)
  }
  browserWindow.setFullScreenable(!!options.fullscreenable)

  let title = options.title
  if (options.frame === false) {
    title = undefined
  } else if (
    typeof title === 'undefined' &&
    typeof __command !== 'undefined' &&
    __command.pluginBundle()
  ) {
    title = __command.pluginBundle().name()
  }

  if (title) {
    browserWindow.setTitle(title)
  }

  var backgroundColor = options.backgroundColor
  if (options.transparent) {
    backgroundColor = NSColor.clearColor()
  }
  if (!backgroundColor && options.frame === false && options.vibrancy) {
    backgroundColor = NSColor.clearColor()
  }

  browserWindow._setBackgroundColor(
    backgroundColor || NSColor.windowBackgroundColor()
  )

  if (options.hasShadow === false) {
    browserWindow.setHasShadow(false)
  }

  if (typeof options.opacity !== 'undefined') {
    browserWindow.setOpacity(options.opacity)
  }

  options.webPreferences = options.webPreferences || {}

  webView
    .configuration()
    .preferences()
    .setValue_forKey(
      options.webPreferences.devTools !== false,
      'developerExtrasEnabled'
    )
  webView
    .configuration()
    .preferences()
    .setValue_forKey(
      options.webPreferences.javascript !== false,
      'javaScriptEnabled'
    )
  webView
    .configuration()
    .preferences()
    .setValue_forKey(!!options.webPreferences.plugins, 'plugInsEnabled')
  webView
    .configuration()
    .preferences()
    .setValue_forKey(
      options.webPreferences.minimumFontSize || 0,
      'minimumFontSize'
    )

  if (options.webPreferences.zoomFactor) {
    webView.setMagnification(options.webPreferences.zoomFactor)
  }

  var contentView = panel.contentView()

  if (options.frame !== false) {
    webView.setFrame(contentView.bounds())
    contentView.addSubview(webView)
  } else {
    // In OSX 10.10, adding subviews to the root view for the NSView hierarchy
    // produces warnings. To eliminate the warnings, we resize the contentView
    // to fill the window, and add subviews to that.
    // http://crbug.com/380412
    contentView.setAutoresizingMask(NSViewWidthSizable | NSViewHeightSizable)
    fitSubviewToView(contentView, contentView.superview())

    webView.setFrame(contentView.bounds())
    contentView.addSubview(webView)

    // The fullscreen button should always be hidden for frameless window.
    if (panel.standardWindowButton(NSWindowFullScreenButton)) {
      panel.standardWindowButton(NSWindowFullScreenButton).setHidden(true)
    }

    if (!options.titleBarStyle || options.titleBarStyle === 'default') {
      // Hide the window buttons.
      panel.standardWindowButton(NSWindowZoomButton).setHidden(true)
      panel.standardWindowButton(NSWindowMiniaturizeButton).setHidden(true)
      panel.standardWindowButton(NSWindowCloseButton).setHidden(true)

      // Some third-party macOS utilities check the zoom button's enabled state to
      // determine whether to show custom UI on hover, so we disable it here to
      // prevent them from doing so in a frameless app window.
      panel.standardWindowButton(NSWindowZoomButton).setEnabled(false)
    }
  }

  if (options.vibrancy) {
    browserWindow.setVibrancy(options.vibrancy)
  }

  // Set maximizable state last to ensure zoom button does not get reset
  // by calls to other APIs.
  browserWindow.setMaximizable(options.maximizable !== false)

  panel.setHidesOnDeactivate(options.hidesOnDeactivate !== false)

  if (options.remembersWindowFrame) {
    panel.setFrameAutosaveName(identifier)
    panel.setFrameUsingName_force(panel.frameAutosaveName(), false)
  }

  if (options.acceptsFirstMouse) {
    browserWindow.on('focus', function(event) {
      if (event.type() === NSEventTypeLeftMouseDown) {
        browserWindow.webContents
          .executeJavaScript(dispatchFirstClick(webView, event))
          .catch(() => {})
      }
    })
  }

  executeJavaScript.injectScript(webView)
  movableArea.injectScript(webView)
  movableArea.setupHandler(browserWindow)

  if (options.show !== false) {
    browserWindow.show()
  }

  browserWindow.on('closed', function() {
    browserWindow._destroyed = true
    threadDictionary.removeObjectForKey(identifier)
    var observer = threadDictionary[identifier + '.themeObserver']
    if (observer) {
      NSApplication.sharedApplication().removeObserver_forKeyPath(
        observer,
        'effectiveAppearance'
      )
      threadDictionary.removeObjectForKey(identifier + '.themeObserver')
    }
    fiber.cleanup()
  })

  threadDictionary[identifier] = panel

  fiber.onCleanup(function() {
    if (!browserWindow._destroyed) {
      browserWindow.destroy()
    }
  })

  return browserWindow
}

BrowserWindow.fromId = function(identifier) {
  var threadDictionary = NSThread.mainThread().threadDictionary()

  if (threadDictionary[identifier]) {
    return BrowserWindow.fromPanel(threadDictionary[identifier], identifier)
  }

  return undefined
}

BrowserWindow.fromPanel = function(panel, identifier) {
  var browserWindow = new EventEmitter()
  browserWindow.id = identifier

  if (!panel || !panel.contentView) {
    throw new Error('needs to pass an NSPanel')
  }

  var webView = null
  var subviews = panel.contentView().subviews()
  for (var i = 0; i < subviews.length; i += 1) {
    if (
      !webView &&
      !subviews[i].isKindOfClass(WKInspectorWKWebView) &&
      subviews[i].isKindOfClass(WKWebView)
    ) {
      webView = subviews[i]
    }
  }

  if (!webView) {
    throw new Error('The panel needs to have a webview')
  }

  buildBrowserAPI(browserWindow, panel, webView)
  buildWebAPI(browserWindow, panel, webView)

  return browserWindow
}

module.exports = BrowserWindow


/***/ }),

/***/ "./node_modules/sketch-module-web-view/lib/inject-client-messaging.js":
/*!****************************************************************************!*\
  !*** ./node_modules/sketch-module-web-view/lib/inject-client-messaging.js ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var CONSTANTS = __webpack_require__(/*! ./constants */ "./node_modules/sketch-module-web-view/lib/constants.js")

module.exports = function(webView) {
  var source =
    'window.originalPostMessage = window.postMessage;' +
    'window.postMessage = function(actionName) {' +
    '  if (!actionName) {' +
    "    throw new Error('missing action name')" +
    '  }' +
    '  var id = String(Math.random()).replace(".", "");' +
    '    var args = [].slice.call(arguments);' +
    '    args.unshift(id);' +
    '  return new Promise(function (resolve, reject) {' +
    '    window["' +
    CONSTANTS.JS_BRIDGE_RESULT_SUCCESS +
    '" + id] = resolve;' +
    '    window["' +
    CONSTANTS.JS_BRIDGE_RESULT_ERROR +
    '" + id] = reject;' +
    '    window.webkit.messageHandlers.' +
    CONSTANTS.JS_BRIDGE +
    '.postMessage(JSON.stringify(args));' +
    '  });' +
    '}'
  var script = WKUserScript.alloc().initWithSource_injectionTime_forMainFrameOnly(
    source,
    0,
    true
  )
  webView
    .configuration()
    .userContentController()
    .addUserScript(script)
}


/***/ }),

/***/ "./node_modules/sketch-module-web-view/lib/movable-area.js":
/*!*****************************************************************!*\
  !*** ./node_modules/sketch-module-web-view/lib/movable-area.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var CONSTANTS = __webpack_require__(/*! ./constants */ "./node_modules/sketch-module-web-view/lib/constants.js")

module.exports.injectScript = function(webView) {
  var source =
    '(function () {' +
    "document.addEventListener('mousedown', onMouseDown);" +
    '' +
    'function shouldDrag(target) {' +
    '  if (!target || (target.dataset || {}).appRegion === "no-drag") { return false }' +
    '  if ((target.dataset || {}).appRegion === "drag") { return true }' +
    '  return shouldDrag(target.parentElement)' +
    '};' +
    '' +
    'function onMouseDown(e) {' +
    '  if (e.button !== 0 || !shouldDrag(e.target)) { return }' +
    '  window.postMessage("' +
    CONSTANTS.START_MOVING_WINDOW +
    '");' +
    '};' +
    '})()'
  var script = WKUserScript.alloc().initWithSource_injectionTime_forMainFrameOnly(
    source,
    0,
    true
  )
  webView
    .configuration()
    .userContentController()
    .addUserScript(script)
}

module.exports.setupHandler = function(browserWindow) {
  var initialMouseLocation = null
  var initialWindowPosition = null
  var interval = null

  function moveWindow() {
    // if the user released the button, stop moving the window
    if (!initialWindowPosition || NSEvent.pressedMouseButtons() !== 1) {
      clearInterval(interval)
      initialMouseLocation = null
      initialWindowPosition = null
      return
    }

    var mouse = NSEvent.mouseLocation()
    browserWindow.setPosition(
      initialWindowPosition.x + (mouse.x - initialMouseLocation.x),
      initialWindowPosition.y + (initialMouseLocation.y - mouse.y), // y is inverted
      false
    )
  }

  browserWindow.webContents.on(CONSTANTS.START_MOVING_WINDOW, function() {
    initialMouseLocation = NSEvent.mouseLocation()
    var position = browserWindow.getPosition()
    initialWindowPosition = {
      x: position[0],
      y: position[1],
    }

    interval = setInterval(moveWindow, 1000 / 60) // 60 fps
  })
}


/***/ }),

/***/ "./node_modules/sketch-module-web-view/lib/parseWebArguments.js":
/*!**********************************************************************!*\
  !*** ./node_modules/sketch-module-web-view/lib/parseWebArguments.js ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function(webArguments) {
  var args = null
  try {
    args = JSON.parse(webArguments)
  } catch (e) {
    // malformed arguments
  }

  if (
    !args ||
    !args.constructor ||
    args.constructor !== Array ||
    args.length == 0
  ) {
    return null
  }

  return args
}


/***/ }),

/***/ "./node_modules/sketch-module-web-view/lib/set-delegates.js":
/*!******************************************************************!*\
  !*** ./node_modules/sketch-module-web-view/lib/set-delegates.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Promise) {var ObjCClass = __webpack_require__(/*! mocha-js-delegate */ "./node_modules/mocha-js-delegate/index.js")
var parseWebArguments = __webpack_require__(/*! ./parseWebArguments */ "./node_modules/sketch-module-web-view/lib/parseWebArguments.js")
var CONSTANTS = __webpack_require__(/*! ./constants */ "./node_modules/sketch-module-web-view/lib/constants.js")

// We create one ObjC class for ourselves here
var WindowDelegateClass
var NavigationDelegateClass
var WebScriptHandlerClass
var ThemeObserverClass

// TODO: events
// - 'page-favicon-updated'
// - 'new-window'
// - 'did-navigate-in-page'
// - 'will-prevent-unload'
// - 'crashed'
// - 'unresponsive'
// - 'responsive'
// - 'destroyed'
// - 'before-input-event'
// - 'certificate-error'
// - 'found-in-page'
// - 'media-started-playing'
// - 'media-paused'
// - 'did-change-theme-color'
// - 'update-target-url'
// - 'cursor-changed'
// - 'context-menu'
// - 'select-bluetooth-device'
// - 'paint'
// - 'console-message'

module.exports = function(browserWindow, panel, webview, options) {
  if (!ThemeObserverClass) {
    ThemeObserverClass = new ObjCClass({
      utils: null,

      'observeValueForKeyPath:ofObject:change:context:': function() {
        this.utils.executeJavaScript(
          "document.body.classList.remove('__skpm-" +
            (typeof MSTheme !== 'undefined' && MSTheme.sharedTheme().isDark()
              ? 'light'
              : 'dark') +
            "'); document.body.classList.add('__skpm-" +
            (typeof MSTheme !== 'undefined' && MSTheme.sharedTheme().isDark()
              ? 'dark'
              : 'light') +
            "')"
        )
      },
    })
  }

  if (!WindowDelegateClass) {
    WindowDelegateClass = new ObjCClass({
      utils: null,
      panel: null,

      'windowDidResize:': function() {
        this.utils.emit('resize')
      },

      'windowDidMiniaturize:': function() {
        this.utils.emit('minimize')
      },

      'windowDidDeminiaturize:': function() {
        this.utils.emit('restore')
      },

      'windowDidEnterFullScreen:': function() {
        this.utils.emit('enter-full-screen')
      },

      'windowDidExitFullScreen:': function() {
        this.utils.emit('leave-full-screen')
      },

      'windowDidMove:': function() {
        this.utils.emit('move')
        this.utils.emit('moved')
      },

      'windowShouldClose:': function() {
        var shouldClose = 1
        this.utils.emit('close', {
          get defaultPrevented() {
            return !shouldClose
          },
          preventDefault: function() {
            shouldClose = 0
          },
        })
        return shouldClose
      },

      'windowWillClose:': function() {
        this.utils.emit('closed')
      },

      'windowDidBecomeKey:': function() {
        this.utils.emit('focus', this.panel.currentEvent())
      },

      'windowDidResignKey:': function() {
        this.utils.emit('blur')
      },
    })
  }

  if (!NavigationDelegateClass) {
    NavigationDelegateClass = new ObjCClass({
      state: {
        wasReady: 0,
      },
      utils: null,

      // // Called when the web view begins to receive web content.
      'webView:didCommitNavigation:': function(webView) {
        this.utils.emit('will-navigate', {}, String(String(webView.URL())))
      },

      // // Called when web content begins to load in a web view.
      'webView:didStartProvisionalNavigation:': function() {
        this.utils.emit('did-start-navigation')
        this.utils.emit('did-start-loading')
      },

      // Called when a web view receives a server redirect.
      'webView:didReceiveServerRedirectForProvisionalNavigation:': function() {
        this.utils.emit('did-get-redirect-request')
      },

      // // Called when the web view needs to respond to an authentication challenge.
      // 'webView:didReceiveAuthenticationChallenge:completionHandler:': function(
      //   webView,
      //   challenge,
      //   completionHandler
      // ) {
      //   function callback(username, password) {
      //     completionHandler(
      //       0,
      //       NSURLCredential.credentialWithUser_password_persistence(
      //         username,
      //         password,
      //         1
      //       )
      //     )
      //   }
      //   var protectionSpace = challenge.protectionSpace()
      //   this.utils.emit(
      //     'login',
      //     {},
      //     {
      //       method: String(protectionSpace.authenticationMethod()),
      //       url: 'not implemented', // TODO:
      //       referrer: 'not implemented', // TODO:
      //     },
      //     {
      //       isProxy: !!protectionSpace.isProxy(),
      //       scheme: String(protectionSpace.protocol()),
      //       host: String(protectionSpace.host()),
      //       port: Number(protectionSpace.port()),
      //       realm: String(protectionSpace.realm()),
      //     },
      //     callback
      //   )
      // },

      // Called when an error occurs during navigation.
      // 'webView:didFailNavigation:withError:': function(
      //   webView,
      //   navigation,
      //   error
      // ) {},

      // Called when an error occurs while the web view is loading content.
      'webView:didFailProvisionalNavigation:withError:': function(
        webView,
        navigation,
        error
      ) {
        this.utils.emit('did-fail-load', error)
      },

      // Called when the navigation is complete.
      'webView:didFinishNavigation:': function() {
        if (this.state.wasReady == 0) {
          this.state.wasReady = 1
          this.utils.emitBrowserEvent('ready-to-show')
        }
        this.utils.emit('did-navigate')
        this.utils.emit('did-frame-navigate')
        this.utils.emit('did-stop-loading')
        this.utils.emit('did-finish-load')
        this.utils.emit('did-frame-finish-load')
      },

      // Called when the web view’s web content process is terminated.
      'webViewWebContentProcessDidTerminate:': function() {
        this.utils.emit('dom-ready')
      },

      // Decides whether to allow or cancel a navigation.
      // webView:decidePolicyForNavigationAction:decisionHandler:

      // Decides whether to allow or cancel a navigation after its response is known.
      // webView:decidePolicyForNavigationResponse:decisionHandler:
    })
  }

  if (!WebScriptHandlerClass) {
    WebScriptHandlerClass = new ObjCClass({
      utils: null,
      'userContentController:didReceiveScriptMessage:': function(_, message) {
        var args = this.utils.parseWebArguments(String(message.body()))
        if (!args) {
          return
        }
        if (!args[0] || typeof args[0] !== 'string') {
          return
        }
        args[0] = String(args[0])

        this.utils.emit.apply(this, args)
      },
    })
  }

  var themeObserver = ThemeObserverClass.new({
    utils: {
      executeJavaScript(script) {
        webview.evaluateJavaScript_completionHandler(script, null)
      },
    },
  })

  var script = WKUserScript.alloc().initWithSource_injectionTime_forMainFrameOnly(
    "document.addEventListener('DOMContentLoaded', function() { document.body.classList.add('__skpm-" +
      (typeof MSTheme !== 'undefined' && MSTheme.sharedTheme().isDark()
        ? 'dark'
        : 'light') +
      "') }, false)",
    0,
    true
  )
  webview
    .configuration()
    .userContentController()
    .addUserScript(script)

  NSApplication.sharedApplication().addObserver_forKeyPath_options_context(
    themeObserver,
    'effectiveAppearance',
    NSKeyValueChangeNewKey,
    null
  )

  var threadDictionary = NSThread.mainThread().threadDictionary()
  threadDictionary[browserWindow.id + '.themeObserver'] = themeObserver

  var navigationDelegate = NavigationDelegateClass.new({
    utils: {
      setTitle: browserWindow.setTitle.bind(browserWindow),
      emitBrowserEvent() {
        try {
          browserWindow.emit.apply(browserWindow, arguments)
        } catch (err) {
          if (
            typeof process !== 'undefined' &&
            process.listenerCount &&
            process.listenerCount('uncaughtException')
          ) {
            process.emit('uncaughtException', err, 'uncaughtException')
          } else {
            console.error(err)
            throw err
          }
        }
      },
      emit() {
        try {
          browserWindow.webContents.emit.apply(
            browserWindow.webContents,
            arguments
          )
        } catch (err) {
          if (
            typeof process !== 'undefined' &&
            process.listenerCount &&
            process.listenerCount('uncaughtException')
          ) {
            process.emit('uncaughtException', err, 'uncaughtException')
          } else {
            console.error(err)
            throw err
          }
        }
      },
    },
    state: {
      wasReady: 0,
    },
  })

  webview.setNavigationDelegate(navigationDelegate)

  var webScriptHandler = WebScriptHandlerClass.new({
    utils: {
      emit(id, type) {
        if (!type) {
          webview.evaluateJavaScript_completionHandler(
            CONSTANTS.JS_BRIDGE_RESULT_SUCCESS + id + '()',
            null
          )
          return
        }

        var args = []
        for (var i = 2; i < arguments.length; i += 1) args.push(arguments[i])

        var listeners = browserWindow.webContents.listeners(type)

        Promise.all(
          listeners.map(function(l) {
            return Promise.resolve().then(function() {
              return l.apply(l, args)
            })
          })
        )
          .then(function(res) {
            webview.evaluateJavaScript_completionHandler(
              CONSTANTS.JS_BRIDGE_RESULT_SUCCESS +
                id +
                '(' +
                JSON.stringify(res) +
                ')',
              null
            )
          })
          .catch(function(err) {
            webview.evaluateJavaScript_completionHandler(
              CONSTANTS.JS_BRIDGE_RESULT_ERROR +
                id +
                '(' +
                JSON.stringify(err) +
                ')',
              null
            )
          })
      },
      parseWebArguments: parseWebArguments,
    },
  })

  webview
    .configuration()
    .userContentController()
    .addScriptMessageHandler_name(webScriptHandler, CONSTANTS.JS_BRIDGE)

  var utils = {
    emit() {
      try {
        browserWindow.emit.apply(browserWindow, arguments)
      } catch (err) {
        if (
          typeof process !== 'undefined' &&
          process.listenerCount &&
          process.listenerCount('uncaughtException')
        ) {
          process.emit('uncaughtException', err, 'uncaughtException')
        } else {
          console.error(err)
          throw err
        }
      }
    },
  }
  if (options.modal) {
    // find the window of the document
    var msdocument
    if (options.parent.type === 'Document') {
      msdocument = options.parent.sketchObject
    } else {
      msdocument = options.parent
    }
    if (msdocument && String(msdocument.class()) === 'MSDocumentData') {
      // we only have an MSDocumentData instead of a MSDocument
      // let's try to get back to the MSDocument
      msdocument = msdocument.delegate()
    }
    utils.parentWindow = msdocument.windowForSheet()
  }

  var windowDelegate = WindowDelegateClass.new({
    utils: utils,
    panel: panel,
  })

  panel.setDelegate(windowDelegate)
}

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@skpm/promise/index.js */ "./node_modules/@skpm/promise/index.js")))

/***/ }),

/***/ "./node_modules/sketch-module-web-view/lib/webview-api.js":
/*!****************************************************************!*\
  !*** ./node_modules/sketch-module-web-view/lib/webview-api.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var EventEmitter = __webpack_require__(/*! events */ "events")
var executeJavaScript = __webpack_require__(/*! ./execute-javascript */ "./node_modules/sketch-module-web-view/lib/execute-javascript.js")

// let's try to match https://github.com/electron/electron/blob/master/docs/api/web-contents.md
module.exports = function buildAPI(browserWindow, panel, webview) {
  var webContents = new EventEmitter()

  webContents.loadURL = browserWindow.loadURL

  webContents.loadFile = function(/* filePath */) {
    // TODO:
    console.warn(
      'Not implemented yet, please open a PR on https://github.com/skpm/sketch-module-web-view :)'
    )
  }

  webContents.downloadURL = function(/* filePath */) {
    // TODO:
    console.warn(
      'Not implemented yet, please open a PR on https://github.com/skpm/sketch-module-web-view :)'
    )
  }

  webContents.getURL = function() {
    return String(webview.url())
  }

  webContents.getTitle = function() {
    return String(webview.title())
  }

  webContents.isDestroyed = function() {
    // TODO:
    console.warn(
      'Not implemented yet, please open a PR on https://github.com/skpm/sketch-module-web-view :)'
    )
  }

  webContents.focus = browserWindow.focus
  webContents.isFocused = browserWindow.isFocused

  webContents.isLoading = function() {
    return !!webview.loading()
  }

  webContents.isLoadingMainFrame = function() {
    // TODO:
    return !!webview.loading()
  }

  webContents.isWaitingForResponse = function() {
    return !webview.loading()
  }

  webContents.stop = function() {
    webview.stopLoading()
  }
  webContents.reload = function() {
    webview.reload()
  }
  webContents.reloadIgnoringCache = function() {
    webview.reloadFromOrigin()
  }
  webContents.canGoBack = function() {
    return !!webview.canGoBack()
  }
  webContents.canGoForward = function() {
    return !!webview.canGoForward()
  }
  webContents.canGoToOffset = function(offset) {
    return !!webview.backForwardList().itemAtIndex(offset)
  }
  webContents.clearHistory = function() {
    // TODO:
    console.warn(
      'Not implemented yet, please open a PR on https://github.com/skpm/sketch-module-web-view :)'
    )
  }
  webContents.goBack = function() {
    webview.goBack()
  }
  webContents.goForward = function() {
    webview.goForward()
  }
  webContents.goToIndex = function(index) {
    var backForwardList = webview.backForwardList()
    var backList = backForwardList.backList()
    var backListLength = backList.count()
    if (backListLength > index) {
      webview.loadRequest(NSURLRequest.requestWithURL(backList[index]))
      return
    }
    var forwardList = backForwardList.forwardList()
    if (forwardList.count() > index - backListLength) {
      webview.loadRequest(
        NSURLRequest.requestWithURL(forwardList[index - backListLength])
      )
      return
    }
    throw new Error('Cannot go to index ' + index)
  }
  webContents.goToOffset = function(offset) {
    if (!webContents.canGoToOffset(offset)) {
      throw new Error('Cannot go to offset ' + offset)
    }
    webview.loadRequest(
      NSURLRequest.requestWithURL(webview.backForwardList().itemAtIndex(offset))
    )
  }
  webContents.isCrashed = function() {
    // TODO:
    console.warn(
      'Not implemented yet, please open a PR on https://github.com/skpm/sketch-module-web-view :)'
    )
  }
  webContents.setUserAgent = function(/* userAgent */) {
    // TODO:
    console.warn(
      'Not implemented yet, please open a PR on https://github.com/skpm/sketch-module-web-view :)'
    )
  }
  webContents.getUserAgent = function() {
    const userAgent = webview.customUserAgent()
    return userAgent ? String(userAgent) : undefined
  }
  webContents.insertCSS = function(css) {
    var source =
      "var style = document.createElement('style'); style.innerHTML = " +
      css.replace(/"/, '\\"') +
      '; document.head.appendChild(style);'
    var script = WKUserScript.alloc().initWithSource_injectionTime_forMainFrameOnly(
      source,
      0,
      true
    )
    webview
      .configuration()
      .userContentController()
      .addUserScript(script)
  }
  webContents.insertJS = function(source) {
    var script = WKUserScript.alloc().initWithSource_injectionTime_forMainFrameOnly(
      source,
      0,
      true
    )
    webview
      .configuration()
      .userContentController()
      .addUserScript(script)
  }
  webContents.executeJavaScript = executeJavaScript(webview, browserWindow)
  webContents.setIgnoreMenuShortcuts = function() {
    // TODO:??
    console.warn(
      'Not implemented yet, please open a PR on https://github.com/skpm/sketch-module-web-view :)'
    )
  }
  webContents.setAudioMuted = function(/* muted */) {
    // TODO:??
    console.warn(
      'Not implemented yet, please open a PR on https://github.com/skpm/sketch-module-web-view :)'
    )
  }
  webContents.isAudioMuted = function() {
    // TODO:??
    console.warn(
      'Not implemented yet, please open a PR on https://github.com/skpm/sketch-module-web-view :)'
    )
  }
  webContents.setZoomFactor = function(factor) {
    webview.setMagnification_centeredAtPoint(factor, CGPointMake(0, 0))
  }
  webContents.getZoomFactor = function(callback) {
    callback(Number(webview.magnification()))
  }
  webContents.setZoomLevel = function(level) {
    // eslint-disable-next-line no-restricted-properties
    webContents.setZoomFactor(Math.pow(1.2, level))
  }
  webContents.getZoomLevel = function(callback) {
    // eslint-disable-next-line no-restricted-properties
    callback(Math.log(Number(webview.magnification())) / Math.log(1.2))
  }
  webContents.setVisualZoomLevelLimits = function(/* minimumLevel, maximumLevel */) {
    // TODO:??
    console.warn(
      'Not implemented yet, please open a PR on https://github.com/skpm/sketch-module-web-view :)'
    )
  }
  webContents.setLayoutZoomLevelLimits = function(/* minimumLevel, maximumLevel */) {
    // TODO:??
    console.warn(
      'Not implemented yet, please open a PR on https://github.com/skpm/sketch-module-web-view :)'
    )
  }

  // TODO:
  // webContents.undo = function() {
  //   webview.undoManager().undo()
  // }
  // webContents.redo = function() {
  //   webview.undoManager().redo()
  // }
  // webContents.cut = webview.cut
  // webContents.copy = webview.copy
  // webContents.paste = webview.paste
  // webContents.pasteAndMatchStyle = webview.pasteAsRichText
  // webContents.delete = webview.delete
  // webContents.replace = webview.replaceSelectionWithText

  webContents.send = function() {
    const script =
      'window.postMessage({' +
      'isSketchMessage: true,' +
      "origin: '" +
      String(__command.identifier()) +
      "'," +
      'args: ' +
      JSON.stringify([].slice.call(arguments)) +
      '}, "*")'
    webview.evaluateJavaScript_completionHandler(script, null)
  }

  webContents.getNativeWebview = function() {
    return webview
  }

  browserWindow.webContents = webContents
}


/***/ }),

/***/ "./node_modules/sketch-module-web-view/remote.js":
/*!*******************************************************!*\
  !*** ./node_modules/sketch-module-web-view/remote.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* globals NSThread */
var threadDictionary = NSThread.mainThread().threadDictionary()

module.exports.getWebview = function(identifier) {
  return __webpack_require__(/*! ./lib */ "./node_modules/sketch-module-web-view/lib/index.js").fromId(identifier) // eslint-disable-line
}

module.exports.isWebviewPresent = function isWebviewPresent(identifier) {
  return !!threadDictionary[identifier]
}

module.exports.sendToWebview = function sendToWebview(identifier, evalString) {
  if (!module.exports.isWebviewPresent(identifier)) {
    return
  }

  var panel = threadDictionary[identifier]
  var webview = null
  var subviews = panel.contentView().subviews()
  for (var i = 0; i < subviews.length; i += 1) {
    if (
      !webview &&
      !subviews[i].isKindOfClass(WKInspectorWKWebView) &&
      subviews[i].isKindOfClass(WKWebView)
    ) {
      webview = subviews[i]
    }
  }

  if (!webview || !webview.evaluateJavaScript_completionHandler) {
    throw new Error('Webview ' + identifier + ' not found')
  }

  webview.evaluateJavaScript_completionHandler(evalString, null)
}


/***/ }),

/***/ "./resources/store/artboard.js":
/*!*************************************!*\
  !*** ./resources/store/artboard.js ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(Promise) {var processMask = function processMask(_ref) {
  var layer = _ref.layer,
      sketch = _ref.sketch;
  return new Promise(function (resolve, reject) {
    if (layer && layer.sketchObject.hasClippingMask()) {
      var maskIndex = layer.index;
      var maskParent = layer.parent;
      layer.sketchObject.setHasClippingMask(false); // create new group to mimic mask behavior

      var maskGroup = new sketch.Group({
        name: 'srm.mask',
        frame: layer.frame,
        layers: [layer.duplicate()]
      }); // splice in mask group, splice out old mask

      maskParent.layers.splice(maskIndex, 1, maskGroup); // loop through mask parent layers,
      // any layer with an index higher than the mask will be masked
      // push masked layers to maskGroup

      maskGroup.parent.layers.forEach(function (maskedLayer, index) {
        if (index > maskIndex) {
          maskedLayer.frame.x = maskedLayer.frame.x - maskGroup.frame.x;
          maskedLayer.frame.y = maskedLayer.frame.y - maskGroup.frame.y;
          maskGroup.layers.push(maskedLayer);
        }
      });
      resolve(maskGroup);
    } else {
      resolve(layer);
    }
  });
};

var isPathClockwise = function isPathClockwise(points) {
  var end = points.length - 1;
  var sum = points[end].point.x * points[0].point.y - points[0].point.x * points[end].point.y;

  for (var i = 0; i < end; i++) {
    var n = i + 1;
    sum += points[i].point.x * points[n].point.y - points[n].point.x * points[i].point.y;
  }

  return sum > 0;
};

var flattenShapePath = function flattenShapePath(_ref2) {
  var layer = _ref2.layer,
      sketch = _ref2.sketch;
  return new Promise(function (resolve, reject) {
    // due to the way PIXI draws lines
    // the path must be clockwise to render correctly
    var isClockwise = isPathClockwise(layer.points);

    if (!isClockwise) {
      layer.sketchObject.reversePath();
    }

    var duplicate = layer.duplicate();
    duplicate.transform.rotation = 0;
    duplicate.transform.flippedHorizontally = false;
    duplicate.transform.flippedVertically = false;
    var svgPath = duplicate.getSVGPath();
    var flatPath = sketch.ShapePath.fromSVGPath(svgPath);
    layer.points = flatPath.points;
    duplicate.remove();
    resolve(layer);
  });
};

var processShapePathBorderOptions = function processShapePathBorderOptions(_ref3) {
  var layer = _ref3.layer;
  return new Promise(function (resolve, reject) {
    var parent = layer.parent,
        index = layer.index,
        style = layer.style;
    var borderOptions = style.borderOptions;

    if (borderOptions.dashPattern.length > 0 || borderOptions.startArrowhead !== 'None' || borderOptions.endArrowhead !== 'None') {
      layer.sketchObject.layersByConvertingToOutlines();
      var outlines = parent.layers[index];
      outlines.name = "[srm.with-border-options]".concat(layer.name);
      outlines.sketchObject.simplify();
      resolve(outlines);
    } else {
      resolve(layer);
    }
  });
};

var processShapePath = function processShapePath(_ref4) {
  var layer = _ref4.layer,
      sketch = _ref4.sketch;
  return new Promise(function (resolve, reject) {
    if (layer && layer.type === 'ShapePath') {
      flattenShapePath({
        layer: layer,
        sketch: sketch
      }).then(function (layerS1) {
        return processShapePathBorderOptions({
          layer: layerS1
        });
      }).then(function (layerS2) {
        resolve(layerS2);
      });
    } else {
      resolve(layer);
    }
  });
};

var processShapeBase = function processShapeBase(_ref5) {
  var layer = _ref5.layer;
  return new Promise(function (resolve, reject) {
    var style = layer.style,
        parent = layer.parent,
        index = layer.index;

    if (layer.sketchObject.canFlatten()) {
      layer.sketchObject.flatten();
      resolve(parent.layers[index]);
    } else {
      if (layer.layers.length === 1) {
        layer.sketchObject.ungroup();
        var ungrouped = parent.layers[index];
        ungrouped.style = style;
        resolve(ungrouped);
      } else {
        resolve(layer);
      }
    }
  });
};

var processShape = function processShape(_ref6) {
  var layer = _ref6.layer,
      sketch = _ref6.sketch;
  return new Promise(function (resolve, reject) {
    if (layer && layer.type === 'Shape') {
      processShapeBase({
        layer: layer
      }) // .then((layerS1) => {
      //   if (layerS1.type === 'Shape') {
      //     return processShapeLayers({
      //       layer: layerS1 as srm.Shape,
      //       sketch: sketch
      //     });
      //   } else {
      //     resolve(layerS1);
      //   }
      // })
      .then(function (layerS2) {
        resolve(layerS2);
      });
    } else {
      resolve(layer);
    }
  });
};

var processRelevant = function processRelevant(_ref7) {
  var layer = _ref7.layer;
  return new Promise(function (resolve, reject) {
    switch (layer.type) {
      case 'Group':
      case 'Shape':
      case 'Image':
      case 'ShapePath':
      case 'Text':
      case 'SymbolInstance':
        resolve(layer);
        break;

      case 'HotSpot':
      case 'Slice':
        layer.remove();
        resolve(null);
        break;
    }
  });
};

var processHidden = function processHidden(_ref8) {
  var layer = _ref8.layer;
  return new Promise(function (resolve, reject) {
    var isHidden = layer && layer.hidden;

    if (isHidden) {
      layer.remove();
      resolve(null);
    } else {
      resolve(layer);
    }
  });
};

var processSymbol = function processSymbol(_ref9) {
  var layer = _ref9.layer;
  return new Promise(function (resolve, reject) {
    if (layer && layer.type === 'SymbolInstance') {
      resolve(layer.detach({
        recursively: true
      }));
    } else {
      resolve(layer);
    }
  });
};

var processText = function processText(_ref10) {
  var layer = _ref10.layer,
      sketch = _ref10.sketch;
  return new Promise(function (resolve, reject) {
    if (layer && layer.type === 'Text') {
      if (layer.text.trim().length === 0) {
        layer.remove();
        resolve(null);
      } else {
        var layerIndex = layer.index;
        var parent = layer.parent;
        layer.sketchObject.layersByConvertingToOutlines();
        var outlines = parent.layers[layerIndex];
        outlines.name = "[srm.text]".concat(layer.name); // because sketch is bugged

        outlines.sketchObject.simplify(); // because pixi is bugged

        outlines.sketchObject.reversePath();
        resolve(outlines);
      }
    } else {
      resolve(layer);
    }
  });
};

var processLayer = function processLayer(_ref11) {
  var layer = _ref11.layer,
      sketch = _ref11.sketch,
      page = _ref11.page;
  return new Promise(function (resolve, reject) {
    processRelevant({
      layer: layer
    }).then(function (layerS1) {
      return processHidden({
        layer: layerS1
      });
    }).then(function (layerS2) {
      return processSymbol({
        layer: layerS2
      });
    }).then(function (layerS3) {
      return processShape({
        layer: layerS3,
        sketch: sketch
      });
    }).then(function (layerS4) {
      return processShapePath({
        layer: layerS4,
        sketch: sketch
      });
    }).then(function (layerS5) {
      return processMask({
        layer: layerS5,
        sketch: sketch
      });
    }).then(function (layerS6) {
      return processText({
        layer: layerS6,
        sketch: sketch
      });
    }).then(function (layerS7) {
      if (layerS7 && layerS7.type === 'Group') {
        processLayers({
          layers: layerS7.layers,
          sketch: sketch,
          page: page
        }).then(function () {
          resolve();
        });
      } else {
        resolve();
      }
    });
  });
};

var processLayers = function processLayers(_ref12) {
  var layers = _ref12.layers,
      sketch = _ref12.sketch,
      page = _ref12.page;
  var promises = [];
  layers.forEach(function (layer) {
    promises.push(processLayer({
      layer: layer,
      sketch: sketch,
      page: page
    }));
  });
  return Promise.all(promises);
};

var getArtboard = function getArtboard(_ref13) {
  var artboard = _ref13.artboard,
      sketch = _ref13.sketch,
      page = _ref13.page;
  return new Promise(function (resolve, reject) {
    processLayers({
      layers: artboard.layers,
      sketch: sketch,
      page: page
    }).then(function () {
      resolve();
    });
  });
};

/* harmony default export */ __webpack_exports__["default"] = (getArtboard);
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@skpm/promise/index.js */ "./node_modules/@skpm/promise/index.js")))

/***/ }),

/***/ "./resources/store/assets.js":
/*!***********************************!*\
  !*** ./resources/store/assets.js ***!
  \***********************************/
/*! exports provided: clearLayerStyles, generateImageAsset, processLayerFills, processLayerBorders, processLayers, getAssets, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(Promise) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "clearLayerStyles", function() { return clearLayerStyles; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "generateImageAsset", function() { return generateImageAsset; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "processLayerFills", function() { return processLayerFills; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "processLayerBorders", function() { return processLayerBorders; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "processLayers", function() { return processLayers; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getAssets", function() { return getAssets; });
/* harmony import */ var _imageAssets__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./imageAssets */ "./resources/store/imageAssets.js");
/* harmony import */ var _shapeAssets__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./shapeAssets */ "./resources/store/shapeAssets.js");
/* harmony import */ var _groupAssets__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./groupAssets */ "./resources/store/groupAssets.js");
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }




var clearLayerStyles = function clearLayerStyles(_ref) {
  var layer = _ref.layer,
      page = _ref.page;
  return new Promise(function (resolve, reject) {
    var style = layer.style,
        transform = layer.transform;

    if (layer.type === 'Text') {
      style.textColor = '#000000ff';
      layer.sketchObject.setTextBehaviour(0);
    } // @ts-ignore


    layer.parent = page;
    style.opacity = 1;
    style.borders = [];
    style.fills = [];
    style.shadows = [];
    style.innerShadows = [];
    style.blur = {
      blurType: 'Gaussian',
      radius: 0,
      motionAngle: 0,
      center: {
        x: 0,
        y: 0
      },
      enabled: false
    };
    transform.flippedHorizontally = false;
    transform.flippedVertically = false;
    transform.rotation = 0;
    resolve(layer);
  });
};
var generateImageAsset = function generateImageAsset(_ref2) {
  var layer = _ref2.layer,
      sketch = _ref2.sketch,
      id = _ref2.id,
      prefix = _ref2.prefix,
      scale = _ref2.scale;
  return new Promise(function (resolve, reject) {
    // create buffer from layer
    var buffer = sketch["export"](layer, _defineProperty({
      formats: 'png',
      scales: scale ? scale : '1',
      output: false
    }, 'save-for-web', true)); // create image layer from buffer

    var bufferImg = new sketch.Image({
      image: buffer
    }); // get base64 from image layer nsdata

    var base64 = bufferImg.image.nsdata.base64EncodedStringWithOptions(0); // create base64 string

    var base64String = "data:image/png;base64,".concat(base64); // return final image

    resolve({
      id: prefix ? "".concat(prefix).concat(id) : id,
      src: base64String
    });
  });
};

var createGradientBorderImage = function createGradientBorderImage(_ref3) {
  var page = _ref3.page,
      layer = _ref3.layer,
      border = _ref3.border,
      gradientOpacity = _ref3.gradientOpacity,
      sketch = _ref3.sketch,
      prefix = _ref3.prefix;
  return new Promise(function (resolve, reject) {
    var padding = function padding() {
      switch (border.position) {
        case 'Outside':
          return border.thickness;

        case 'Center':
          return border.thickness / 2;

        case 'Inside':
          return 0;
      }
    }; // create new layer with gradient


    var gradientImage = new sketch.ShapePath({
      parent: page,
      frame: Object.assign(Object.assign({}, layer.frame), {
        width: layer.frame.width + padding(),
        height: layer.frame.height + padding()
      }),
      style: {
        fills: [{
          fillType: 'Gradient',
          gradient: border.gradient
        }],
        borders: [],
        opacity: gradientOpacity
      }
    }); // export image to temp dir

    generateImageAsset({
      layer: gradientImage,
      sketch: sketch,
      id: layer.id,
      prefix: prefix
    }).then(function (imageAsset) {
      // remove image from page
      gradientImage.remove(); // return final image

      resolve(imageAsset);
    });
  });
};

var createGradientFillImage = function createGradientFillImage(_ref4) {
  var page = _ref4.page,
      layer = _ref4.layer,
      gradient = _ref4.gradient,
      gradientOpacity = _ref4.gradientOpacity,
      sketch = _ref4.sketch,
      prefix = _ref4.prefix;
  return new Promise(function (resolve, reject) {
    // create new layer with gradient
    var gradientImage = new sketch.ShapePath({
      parent: page,
      frame: layer.frame,
      style: {
        fills: [{
          fillType: 'Gradient',
          gradient: gradient
        }],
        borders: [],
        opacity: gradientOpacity
      }
    }); // export image to temp dir

    generateImageAsset({
      layer: gradientImage,
      sketch: sketch,
      id: layer.id,
      prefix: prefix
    }).then(function (imageAsset) {
      // remove image from page
      gradientImage.remove(); // return final image

      resolve(imageAsset);
    });
  });
};

var createPatternFillImage = function createPatternFillImage(_ref5) {
  var page = _ref5.page,
      layer = _ref5.layer,
      pattern = _ref5.pattern,
      fillOpacity = _ref5.fillOpacity,
      sketch = _ref5.sketch,
      prefix = _ref5.prefix;
  return new Promise(function (resolve, reject) {
    // create new layer with pattern
    // add transparent border to include any layer whitespace
    var patternImage = new sketch.ShapePath({
      parent: page,
      frame: layer.frame,
      style: {
        fills: [{
          fillType: 'Pattern',
          pattern: pattern
        }],
        borders: [{
          fillType: 'Color',
          position: 'Inside',
          color: '#00000001'
        }],
        opacity: fillOpacity
      }
    }); // generate base64 image from layer

    generateImageAsset({
      layer: patternImage,
      sketch: sketch,
      id: layer.id,
      prefix: prefix
    }).then(function (imageAsset) {
      // remove image from page
      patternImage.remove(); // return final base64 image

      resolve(imageAsset);
    });
  });
};

var processLayerBorderGradient = function processLayerBorderGradient(_ref6) {
  var page = _ref6.page,
      layer = _ref6.layer,
      border = _ref6.border,
      borderIndex = _ref6.borderIndex,
      sketch = _ref6.sketch;
  return new Promise(function (resolve, reject) {
    createGradientBorderImage({
      page: page,
      layer: layer,
      border: border,
      gradientOpacity: border.sketchObject.contextSettings().opacity(),
      sketch: sketch,
      prefix: "[border-".concat(borderIndex, "]")
    }).then(function (gradientBorderImage) {
      resolve(gradientBorderImage);
    });
  });
};

var processLayerFillGradient = function processLayerFillGradient(_ref7) {
  var page = _ref7.page,
      layer = _ref7.layer,
      fill = _ref7.fill,
      fillIndex = _ref7.fillIndex,
      sketch = _ref7.sketch;
  return new Promise(function (resolve, reject) {
    createGradientFillImage({
      page: page,
      layer: layer,
      gradient: fill.gradient,
      gradientOpacity: fill.sketchObject.contextSettings().opacity(),
      sketch: sketch,
      prefix: "[fill-".concat(fillIndex, "]")
    }).then(function (gradientFillImage) {
      resolve(gradientFillImage);
    });
  });
};

var processLayerFillPattern = function processLayerFillPattern(_ref8) {
  var page = _ref8.page,
      layer = _ref8.layer,
      fill = _ref8.fill,
      fillIndex = _ref8.fillIndex,
      sketch = _ref8.sketch;
  return new Promise(function (resolve, reject) {
    if (fill.pattern.image) {
      createPatternFillImage({
        page: page,
        layer: layer,
        pattern: fill.pattern,
        fillOpacity: fill.sketchObject.contextSettings().opacity(),
        sketch: sketch,
        prefix: "[fill-".concat(fillIndex, "]")
      }).then(function (patternFillImage) {
        resolve(patternFillImage);
      });
    } else {
      resolve(null);
    }
  });
};

var processLayerFill = function processLayerFill(_ref9) {
  var page = _ref9.page,
      layer = _ref9.layer,
      fill = _ref9.fill,
      fillIndex = _ref9.fillIndex,
      sketch = _ref9.sketch;
  return new Promise(function (resolve, reject) {
    switch (fill.fillType) {
      case 'Pattern':
        processLayerFillPattern({
          page: page,
          layer: layer,
          fill: fill,
          fillIndex: fillIndex,
          sketch: sketch
        }).then(function (layerImage) {
          resolve(layerImage);
        });
        break;

      case 'Gradient':
        processLayerFillGradient({
          page: page,
          layer: layer,
          fill: fill,
          fillIndex: fillIndex,
          sketch: sketch
        }).then(function (layerImage) {
          resolve(layerImage);
        });
        break;

      case 'Color':
        resolve(null);
        break;
    }
  });
};

var processLayerFills = function processLayerFills(_ref10) {
  var page = _ref10.page,
      layer = _ref10.layer,
      sketch = _ref10.sketch,
      fills = _ref10.fills;
  var promises = [];
  fills.forEach(function (fill, fillIndex) {
    if (fill.enabled) {
      promises.push(processLayerFill({
        page: page,
        layer: layer,
        fill: fill,
        fillIndex: fillIndex,
        sketch: sketch
      }));
    }
  });
  return Promise.all(promises);
};

var processLayerBorder = function processLayerBorder(_ref11) {
  var page = _ref11.page,
      layer = _ref11.layer,
      border = _ref11.border,
      borderIndex = _ref11.borderIndex,
      sketch = _ref11.sketch;
  return new Promise(function (resolve, reject) {
    switch (border.fillType) {
      case 'Gradient':
        processLayerBorderGradient({
          page: page,
          layer: layer,
          border: border,
          borderIndex: borderIndex,
          sketch: sketch
        }).then(function (layerImage) {
          resolve(layerImage);
        });
        break;

      case 'Pattern':
      case 'Color':
        resolve(null);
        break;
    }
  });
};

var processLayerBorders = function processLayerBorders(_ref12) {
  var page = _ref12.page,
      layer = _ref12.layer,
      sketch = _ref12.sketch,
      borders = _ref12.borders;
  var promises = [];
  borders.forEach(function (border, borderIndex) {
    if (border.enabled) {
      promises.push(processLayerBorder({
        page: page,
        layer: layer,
        border: border,
        borderIndex: borderIndex,
        sketch: sketch
      }));
    }
  });
  return Promise.all(promises);
};

var processLayer = function processLayer(_ref13) {
  var page = _ref13.page,
      layer = _ref13.layer,
      sketch = _ref13.sketch;
  return new Promise(function (resolve, reject) {
    var layerImages = [];

    switch (layer.type) {
      case 'Image':
        Object(_imageAssets__WEBPACK_IMPORTED_MODULE_0__["default"])({
          page: page,
          layer: layer,
          sketch: sketch
        }).then(function (imageLayerImages) {
          layerImages.push.apply(layerImages, _toConsumableArray(imageLayerImages));
        })["finally"](function () {
          resolve(layerImages);
        });
        break;

      case 'Shape':
      case 'ShapePath':
        Object(_shapeAssets__WEBPACK_IMPORTED_MODULE_1__["default"])({
          page: page,
          layer: layer,
          sketch: sketch
        }).then(function (shapeLayerImages) {
          layerImages.push.apply(layerImages, _toConsumableArray(shapeLayerImages));
        })["finally"](function () {
          resolve(layerImages);
        });
        break;

      case 'Group':
        Object(_groupAssets__WEBPACK_IMPORTED_MODULE_2__["default"])({
          page: page,
          layer: layer,
          sketch: sketch
        }).then(function (groupLayerImages) {
          layerImages.push.apply(layerImages, _toConsumableArray(groupLayerImages));
        })["finally"](function () {
          resolve(layerImages);
        });
        break;

      default:
        resolve(layerImages);
    }
  });
};

var processLayers = function processLayers(_ref14) {
  var page = _ref14.page,
      layers = _ref14.layers,
      sketch = _ref14.sketch;
  var promises = [];
  layers.forEach(function (layer) {
    promises.push(processLayer({
      page: page,
      layer: layer,
      sketch: sketch
    }));
  });
  return Promise.all(promises);
};
var getAssets = function getAssets(_ref15) {
  var page = _ref15.page,
      artboard = _ref15.artboard,
      sketch = _ref15.sketch;
  return new Promise(function (resolve, reject) {
    processLayers({
      page: page,
      layers: artboard.layers,
      sketch: sketch
    }).then(function (layerImages) {
      var images = layerImages.reduce(function (imageArray, layerImageArray) {
        return [].concat(_toConsumableArray(imageArray), _toConsumableArray(layerImageArray));
      }, []);
      resolve(images);
    });
  });
};
/* harmony default export */ __webpack_exports__["default"] = (getAssets);
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@skpm/promise/index.js */ "./node_modules/@skpm/promise/index.js")))

/***/ }),

/***/ "./resources/store/groupAssets.js":
/*!****************************************!*\
  !*** ./resources/store/groupAssets.js ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(Promise) {/* harmony import */ var _assets__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./assets */ "./resources/store/assets.js");
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }



var processGroupLayerAssets = function processGroupLayerAssets(_ref) {
  var page = _ref.page,
      layer = _ref.layer,
      sketch = _ref.sketch;
  return new Promise(function (resolve, reject) {
    var layerImages = [];
    Object(_assets__WEBPACK_IMPORTED_MODULE_0__["processLayers"])({
      page: page,
      layers: layer.layers,
      sketch: sketch
    }).then(function (groupLayerImages) {
      var images = groupLayerImages.reduce(function (imageArray, layerImageArray) {
        return [].concat(_toConsumableArray(imageArray), _toConsumableArray(layerImageArray));
      }, []);
      layerImages.push.apply(layerImages, _toConsumableArray(images));
    })["finally"](function () {
      resolve(layerImages);
    });
  });
};

/* harmony default export */ __webpack_exports__["default"] = (processGroupLayerAssets);
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@skpm/promise/index.js */ "./node_modules/@skpm/promise/index.js")))

/***/ }),

/***/ "./resources/store/imageAssets.js":
/*!****************************************!*\
  !*** ./resources/store/imageAssets.js ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(Promise) {/* harmony import */ var _assets__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./assets */ "./resources/store/assets.js");
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }



var processLayerImage = function processLayerImage(_ref) {
  var page = _ref.page,
      layer = _ref.layer,
      sketch = _ref.sketch;
  return new Promise(function (resolve, reject) {
    // create image layer from image date
    var baseImage = new sketch.Image({
      image: layer.image,
      frame: layer.frame,
      parent: page
    });
    Object(_assets__WEBPACK_IMPORTED_MODULE_0__["generateImageAsset"])({
      layer: baseImage,
      sketch: sketch,
      id: layer.id,
      prefix: '[image]'
    }).then(function (imageAsset) {
      // remove asset artboard from page
      baseImage.remove(); // return base64 image

      resolve(imageAsset);
    });
  });
};

var processImageLayerAssets = function processImageLayerAssets(_ref2) {
  var page = _ref2.page,
      layer = _ref2.layer,
      sketch = _ref2.sketch;
  return new Promise(function (resolve, reject) {
    var style = layer.style;
    var fills = style.fills,
        borders = style.borders,
        shadows = style.shadows,
        innerShadows = style.innerShadows;
    var layerImages = [];
    processLayerImage({
      page: page,
      layer: layer,
      sketch: sketch
    }).then(function (layerImage) {
      layerImages.push(layerImage);
      return Object(_assets__WEBPACK_IMPORTED_MODULE_0__["processLayerFills"])({
        page: page,
        layer: layer,
        sketch: sketch,
        fills: fills
      });
    }).then(function (fillImages) {
      var newImages = fillImages.filter(function (fillImage) {
        return fillImage;
      });
      layerImages.push.apply(layerImages, _toConsumableArray(newImages));
      return Object(_assets__WEBPACK_IMPORTED_MODULE_0__["processLayerBorders"])({
        page: page,
        layer: layer,
        sketch: sketch,
        borders: borders
      });
    }).then(function (borderImages) {
      var newImages = borderImages.filter(function (borderImage) {
        return borderImage;
      });
      layerImages.push.apply(layerImages, _toConsumableArray(newImages));
    })["finally"](function () {
      resolve(layerImages);
    });
  });
};

/* harmony default export */ __webpack_exports__["default"] = (processImageLayerAssets);
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@skpm/promise/index.js */ "./node_modules/@skpm/promise/index.js")))

/***/ }),

/***/ "./resources/store/index.js":
/*!**********************************!*\
  !*** ./resources/store/index.js ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(Promise) {/* harmony import */ var _artboard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./artboard */ "./resources/store/artboard.js");
/* harmony import */ var _assets__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./assets */ "./resources/store/assets.js");



var getStore = function getStore(_ref) {
  var page = _ref.page,
      artboard = _ref.artboard,
      sketch = _ref.sketch;
  return new Promise(function (resolve, reject) {
    // create new page for clean asset generation
    var srmPage = new sketch.Page({
      name: "srm.page",
      parent: page.parent
    }); // duplicate selected artboard and set on new page

    var srmArtboard = artboard.duplicate();
    srmArtboard.parent = srmPage;
    srmArtboard.frame.x = 0;
    srmArtboard.frame.y = 0;
    srmArtboard.background.includedInExport = true;
    console.log('Processing Artboard');
    Object(_artboard__WEBPACK_IMPORTED_MODULE_0__["default"])({
      artboard: srmArtboard,
      sketch: sketch,
      page: page
    }).then(function () {
      console.log('Processing Assets');
      return Object(_assets__WEBPACK_IMPORTED_MODULE_1__["default"])({
        page: srmPage,
        artboard: srmArtboard,
        sketch: sketch
      });
    }).then(function (images) {
      console.log('Assets Created'); // remove page

      srmPage.remove(); // select original page

      page.selected = true; // return final store

      resolve({
        artboard: srmArtboard,
        images: images
      });
    });
  });
};

/* harmony default export */ __webpack_exports__["default"] = (getStore);
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@skpm/promise/index.js */ "./node_modules/@skpm/promise/index.js")))

/***/ }),

/***/ "./resources/store/shapeAssets.js":
/*!****************************************!*\
  !*** ./resources/store/shapeAssets.js ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(Promise) {/* harmony import */ var _assets__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./assets */ "./resources/store/assets.js");
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }



var processShapeLayerAssets = function processShapeLayerAssets(_ref) {
  var page = _ref.page,
      layer = _ref.layer,
      sketch = _ref.sketch;
  return new Promise(function (resolve, reject) {
    var style = layer.style;
    var fills = style.fills,
        borders = style.borders,
        shadows = style.shadows,
        innerShadows = style.innerShadows;
    var layerImages = [];
    Object(_assets__WEBPACK_IMPORTED_MODULE_0__["processLayerFills"])({
      page: page,
      layer: layer,
      sketch: sketch,
      fills: fills
    }).then(function (fillImages) {
      var newImages = fillImages.filter(function (fillImage) {
        return fillImage;
      });
      layerImages.push.apply(layerImages, _toConsumableArray(newImages));
      return Object(_assets__WEBPACK_IMPORTED_MODULE_0__["processLayerBorders"])({
        page: page,
        layer: layer,
        sketch: sketch,
        borders: borders
      });
    }).then(function (borderImages) {
      var newImages = borderImages.filter(function (borderImage) {
        return borderImage;
      });
      layerImages.push.apply(layerImages, _toConsumableArray(newImages));
    })["finally"](function () {
      resolve(layerImages);
    });
  });
};

/* harmony default export */ __webpack_exports__["default"] = (processShapeLayerAssets);
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./node_modules/@skpm/promise/index.js */ "./node_modules/@skpm/promise/index.js")))

/***/ }),

/***/ "./resources/ui/index.html":
/*!*********************************!*\
  !*** ./resources/ui/index.html ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "file://" + String(context.scriptPath).split(".sketchplugin/Contents/Sketch")[0] + ".sketchplugin/Contents/Resources/_webpack_resources/b63b979daaf1d51d0133cf98ccbeb494.html";

/***/ }),

/***/ "./resources/ui/loading.html":
/*!***********************************!*\
  !*** ./resources/ui/loading.html ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "file://" + String(context.scriptPath).split(".sketchplugin/Contents/Sketch")[0] + ".sketchplugin/Contents/Resources/_webpack_resources/d5b9bcc5e675d7f66a210f8e6e71e346.html";

/***/ }),

/***/ "./src/render.js":
/*!***********************!*\
  !*** ./src/render.js ***!
  \***********************/
/*! exports provided: default, onShutdown */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "onShutdown", function() { return onShutdown; });
/* harmony import */ var sketch_dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! sketch/dom */ "sketch/dom");
/* harmony import */ var sketch_dom__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(sketch_dom__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var sketch_ui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! sketch/ui */ "sketch/ui");
/* harmony import */ var sketch_ui__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(sketch_ui__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var sketch_module_web_view__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! sketch-module-web-view */ "./node_modules/sketch-module-web-view/lib/index.js");
/* harmony import */ var sketch_module_web_view__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(sketch_module_web_view__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var sketch_module_web_view_remote__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! sketch-module-web-view/remote */ "./node_modules/sketch-module-web-view/remote.js");
/* harmony import */ var sketch_module_web_view_remote__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(sketch_module_web_view_remote__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _resources_store__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../resources/store */ "./resources/store/index.js");
// @ts-ignore
 // @ts-ignore

 // @ts-ignore

 // @ts-ignore



var appWindowIdentifier = 'srm.appWindow';
var loadingWindowIdentifier = 'srm.loadingWindow';
/* harmony default export */ __webpack_exports__["default"] = (function (context) {
  // close any existing windows
  var existingAppWindow = Object(sketch_module_web_view_remote__WEBPACK_IMPORTED_MODULE_3__["getWebview"])(appWindowIdentifier);
  var existingLoadingWindow = Object(sketch_module_web_view_remote__WEBPACK_IMPORTED_MODULE_3__["getWebview"])(loadingWindowIdentifier);

  if (existingAppWindow) {
    existingAppWindow.close();
  } else if (existingLoadingWindow) {
    existingLoadingWindow.close();
  } // get sketch document


  var document = sketch_dom__WEBPACK_IMPORTED_MODULE_0___default.a.getSelectedDocument(); // get sketch selected page

  var page = document.selectedPage; // get sketch selected layers

  var selectedLayers = document.selectedLayers; // get sketch selected artboard

  var selectedArtboard = selectedLayers.layers.find(function (layer) {
    return layer.type === 'Artboard' && layer.selected;
  }); // if artboard selected, run command

  if (selectedArtboard) {
    // set base store
    var store = null; // set theme

    var theme = sketch_ui__WEBPACK_IMPORTED_MODULE_1___default.a.getTheme(); // set loading modal window

    var loadingWindow = new sketch_module_web_view__WEBPACK_IMPORTED_MODULE_2___default.a({
      identifier: loadingWindowIdentifier,
      parent: document,
      modal: true,
      show: false
    }); // set app window

    var appWindow = new sketch_module_web_view__WEBPACK_IMPORTED_MODULE_2___default.a({
      identifier: appWindowIdentifier,
      width: 1200,
      height: 900,
      fullscreenable: false,
      show: false
    }); // set loading window contents

    var loadingWebContents = loadingWindow.webContents; // set app window contents

    var appWebContents = appWindow.webContents; // load loading.html in loading modal

    loadingWindow.loadURL(__webpack_require__(/*! ../resources/ui/loading.html */ "./resources/ui/loading.html")); // display loading modal when loaded

    loadingWebContents.on('did-finish-load', function () {
      // before showing loading window, set window styles based on theme
      loadingWebContents.executeJavaScript("setLoadingColor('".concat(theme, "')")) // after setting styles, show window and load app
      .then(function () {
        loadingWindow.show();
        appWindow.loadURL(__webpack_require__(/*! ../resources/ui/index.html */ "./resources/ui/index.html"));
      });
    }); // wait till app index finished loading

    appWebContents.on('did-finish-load', function () {
      // get store when index loads
      Object(_resources_store__WEBPACK_IMPORTED_MODULE_4__["default"])({
        page: page,
        artboard: selectedArtboard,
        sketch: sketch_dom__WEBPACK_IMPORTED_MODULE_0___default.a
      }) // set plugin store && update loading text
      .then(function (appStore) {
        store = appStore;
        return loadingWebContents.executeJavaScript("setLoadingText('Rendering', 'Drawing canvas')");
      }) // maximize app window size && render app
      .then(function () {
        appWindow.maximize();
        appWindow.center();
        return appWebContents.executeJavaScript("renderApp(\n            ".concat(JSON.stringify(store.artboard), ",\n            ").concat(JSON.stringify(store.images), ",\n            ").concat(JSON.stringify(theme), "\n          )"));
      }) // close loading window && open app window
      ["finally"](function () {
        loadingWindow.close();
        appWindow.show();
      });
    }); // if app failed to load,
    // close windows and display alert

    appWebContents.on('did-fail-load', function () {
      loadingWindow.close();
      appWindow.close();
      sketch_ui__WEBPACK_IMPORTED_MODULE_1___default.a.alert('Error', 'Spec failed to load.');
    });
  } else {
    // if artboard not selected, alert user
    sketch_ui__WEBPACK_IMPORTED_MODULE_1___default.a.alert('Invalid Selection', 'Select an artboard to render.');
  }
});
var onShutdown = function onShutdown() {
  var existingAppWindow = Object(sketch_module_web_view_remote__WEBPACK_IMPORTED_MODULE_3__["getWebview"])(appWindowIdentifier);
  var existingLoadingWindow = Object(sketch_module_web_view_remote__WEBPACK_IMPORTED_MODULE_3__["getWebview"])(loadingWindowIdentifier);

  if (existingAppWindow) {
    existingAppWindow.close();
  } else if (existingLoadingWindow) {
    existingLoadingWindow.close();
  }
};

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("events");

/***/ }),

/***/ "sketch/dom":
/*!*****************************!*\
  !*** external "sketch/dom" ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("sketch/dom");

/***/ }),

/***/ "sketch/ui":
/*!****************************!*\
  !*** external "sketch/ui" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("sketch/ui");

/***/ })

/******/ });
    if (key === 'default' && typeof exports === 'function') {
      exports(context);
    } else if (typeof exports[key] !== 'function') {
      throw new Error('Missing export named "' + key + '". Your command should contain something like `export function " + key +"() {}`.');
    } else {
      exports[key](context);
    }
  } catch (err) {
    if (typeof process !== 'undefined' && process.listenerCount && process.listenerCount('uncaughtException')) {
      process.emit("uncaughtException", err, "uncaughtException");
    } else {
      throw err
    }
  }
}
globalThis['onRun'] = __skpm_run.bind(this, 'default');
globalThis['onShutdown'] = __skpm_run.bind(this, 'onShutdown')

//# sourceMappingURL=__render.js.map