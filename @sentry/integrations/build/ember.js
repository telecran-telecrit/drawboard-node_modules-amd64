(function (__window) {
var exports = {};

Object.defineProperty(exports, '__esModule', { value: true });

/**
 * Consumes the promise and logs the error when it rejects.
 * @param promise A promise to forget.
 */

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var setPrototypeOf = Object.setPrototypeOf || ({ __proto__: [] } instanceof Array ? setProtoOf : mixinProperties); // tslint:disable-line:no-unbound-method
/**
 * setPrototypeOf polyfill using __proto__
 */
function setProtoOf(obj, proto) {
    // @ts-ignore
    obj.__proto__ = proto;
    return obj;
}
/**
 * setPrototypeOf polyfill using mixin
 */
function mixinProperties(obj, proto) {
    for (var prop in proto) {
        if (!obj.hasOwnProperty(prop)) {
            // @ts-ignore
            obj[prop] = proto[prop];
        }
    }
    return obj;
}

/** An error emitted by Sentry SDKs and related utilities. */
var SentryError = /** @class */ (function (_super) {
    __extends(SentryError, _super);
    function SentryError(message) {
        var _newTarget = this.constructor;
        var _this = _super.call(this, message) || this;
        _this.message = message;
        // tslint:disable:no-unsafe-any
        _this.name = _newTarget.prototype.constructor.name;
        setPrototypeOf(_this, _newTarget.prototype);
        return _this;
    }
    return SentryError;
}(Error));

/**
 * Checks whether given value's type is one of a few Error or Error-like
 * {@link isError}.
 *
 * @param wat A value to be checked.
 * @returns A boolean representing the result.
 */
/**
 * Checks whether given value's type is an instance of provided constructor.
 * {@link isInstanceOf}.
 *
 * @param wat A value to be checked.
 * @param base A constructor to be used in a check.
 * @returns A boolean representing the result.
 */
function isInstanceOf(wat, base) {
    try {
        // tslint:disable-next-line:no-unsafe-any
        return wat instanceof base;
    }
    catch (_e) {
        return false;
    }
}

/**
 * Requires a module which is protected against bundler minification.
 *
 * @param request The module path to resolve
 */
function dynamicRequire(mod, request) {
    // tslint:disable-next-line: no-unsafe-any
    return mod.require(request);
}
/**
 * Checks whether we're in the Node.js or Browser environment
 *
 * @returns Answer to given question
 */
function isNodeEnv() {
    // tslint:disable:strict-type-predicates
    return Object.prototype.toString.call(typeof process !== 'undefined' ? process : 0) === '[object process]';
}
var fallbackGlobalObject = {};
/**
 * Safely get global scope object
 *
 * @returns Global scope object
 */
function getGlobalObject() {
    return (isNodeEnv()
        ? global
        : typeof window !== 'undefined'
            ? window
            : typeof self !== 'undefined'
                ? self
                : fallbackGlobalObject);
}
/** JSDoc */
function consoleSandbox(callback) {
    var global = getGlobalObject();
    var levels = ['debug', 'info', 'warn', 'error', 'log', 'assert'];
    if (!('console' in global)) {
        return callback();
    }
    var originalConsole = global.console;
    var wrappedLevels = {};
    // Restore all wrapped console methods
    levels.forEach(function (level) {
        if (level in global.console && originalConsole[level].__sentry_original__) {
            wrappedLevels[level] = originalConsole[level];
            originalConsole[level] = originalConsole[level].__sentry_original__;
        }
    });
    // Perform callback manipulations
    var result = callback();
    // Revert restoration to wrapped state
    Object.keys(wrappedLevels).forEach(function (level) {
        originalConsole[level] = wrappedLevels[level];
    });
    return result;
}
var INITIAL_TIME = Date.now();
var prevNow = 0;
var performanceFallback = {
    now: function () {
        var now = Date.now() - INITIAL_TIME;
        if (now < prevNow) {
            now = prevNow;
        }
        prevNow = now;
        return now;
    },
    timeOrigin: INITIAL_TIME,
};
var crossPlatformPerformance = (function () {
    if (isNodeEnv()) {
        try {
            var perfHooks = dynamicRequire(module, 'perf_hooks');
            return perfHooks.performance;
        }
        catch (_) {
            return performanceFallback;
        }
    }
    if (getGlobalObject().performance) {
        // Polyfill for performance.timeOrigin.
        //
        // While performance.timing.navigationStart is deprecated in favor of performance.timeOrigin, performance.timeOrigin
        // is not as widely supported. Namely, performance.timeOrigin is undefined in Safari as of writing.
        // tslint:disable-next-line:strict-type-predicates
        if (performance.timeOrigin === undefined) {
            // As of writing, performance.timing is not available in Web Workers in mainstream browsers, so it is not always a
            // valid fallback. In the absence of a initial time provided by the browser, fallback to INITIAL_TIME.
            // @ts-ignore
            // tslint:disable-next-line:deprecation
            performance.timeOrigin = (performance.timing && performance.timing.navigationStart) || INITIAL_TIME;
        }
    }
    return getGlobalObject().performance || performanceFallback;
})();

// TODO: Implement different loggers for different environments
var global$1 = getGlobalObject();
/** Prefix for logging strings */
var PREFIX = 'Sentry Logger ';
/** JSDoc */
var Logger = /** @class */ (function () {
    /** JSDoc */
    function Logger() {
        this._enabled = false;
    }
    /** JSDoc */
    Logger.prototype.disable = function () {
        this._enabled = false;
    };
    /** JSDoc */
    Logger.prototype.enable = function () {
        this._enabled = true;
    };
    /** JSDoc */
    Logger.prototype.log = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (!this._enabled) {
            return;
        }
        consoleSandbox(function () {
            global$1.console.log(PREFIX + "[Log]: " + args.join(' ')); // tslint:disable-line:no-console
        });
    };
    /** JSDoc */
    Logger.prototype.warn = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (!this._enabled) {
            return;
        }
        consoleSandbox(function () {
            global$1.console.warn(PREFIX + "[Warn]: " + args.join(' ')); // tslint:disable-line:no-console
        });
    };
    /** JSDoc */
    Logger.prototype.error = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (!this._enabled) {
            return;
        }
        consoleSandbox(function () {
            global$1.console.error(PREFIX + "[Error]: " + args.join(' ')); // tslint:disable-line:no-console
        });
    };
    return Logger;
}());
// Ensure we only have a single logger instance, even if multiple versions of @sentry/utils are being used
global$1.__SENTRY__ = global$1.__SENTRY__ || {};
var logger = global$1.__SENTRY__.logger || (global$1.__SENTRY__.logger = new Logger());

// tslint:disable:no-unsafe-any

// Slightly modified (no IE8 support, ES6) and transcribed to TypeScript

/** SyncPromise internal states */
var States;
(function (States) {
    /** Pending */
    States["PENDING"] = "PENDING";
    /** Resolved / OK */
    States["RESOLVED"] = "RESOLVED";
    /** Rejected / Error */
    States["REJECTED"] = "REJECTED";
})(States || (States = {}));

/* tslint:disable:only-arrow-functions no-unsafe-any */
var global$2 = getGlobalObject();

/** JSDoc */
var Ember = /** @class */ (function () {
    /**
     * @inheritDoc
     */
    function Ember(options) {
        if (options === void 0) { options = {}; }
        /**
         * @inheritDoc
         */
        this.name = Ember.id;
        // tslint:disable-next-line: no-unsafe-any
        this._Ember = options.Ember || getGlobalObject().Ember;
    }
    /**
     * @inheritDoc
     */
    Ember.prototype.setupOnce = function (_, getCurrentHub) {
        // tslint:disable:no-unsafe-any
        var _this = this;
        if (!this._Ember) {
            logger.error('EmberIntegration is missing an Ember instance');
            return;
        }
        var oldOnError = this._Ember.onerror;
        this._Ember.onerror = function (error) {
            if (getCurrentHub().getIntegration(Ember)) {
                getCurrentHub().captureException(error, { originalException: error });
            }
            if (typeof oldOnError === 'function') {
                oldOnError.call(_this._Ember, error);
            }
            else if (_this._Ember.testing) {
                throw error;
            }
        };
        this._Ember.RSVP.on('error', function (reason) {
            if (getCurrentHub().getIntegration(Ember)) {
                getCurrentHub().withScope(function (scope) {
                    if (isInstanceOf(reason, Error)) {
                        scope.setExtra('context', 'Unhandled Promise error detected');
                        getCurrentHub().captureException(reason, { originalException: reason });
                    }
                    else {
                        scope.setExtra('reason', reason);
                        getCurrentHub().captureMessage('Unhandled Promise error detected');
                    }
                });
            }
        });
    };
    /**
     * @inheritDoc
     */
    Ember.id = 'Ember';
    return Ember;
}());

exports.Ember = Ember;


  __window.Sentry = __window.Sentry || {};
  __window.Sentry.Integrations = __window.Sentry.Integrations || {};
  for (var key in exports) {
    if (Object.prototype.hasOwnProperty.call(exports, key)) {
      __window.Sentry.Integrations[key] = exports[key];
    }
  }
  
}(window));
//# sourceMappingURL=ember.js.map
