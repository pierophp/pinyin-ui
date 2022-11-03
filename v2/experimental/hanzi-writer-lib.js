/*!
 * Hanzi Writer v0.6.0
 * https://chanind.github.io/hanzi-writer
 */
module.exports = /******/ (function(modules) {
  // webpackBootstrap
  /******/ // The module cache
  /******/ var installedModules = {}; // The require function
  /******/
  /******/ /******/ function __webpack_require__(moduleId) {
    /******/
    /******/ // Check if module is in cache
    /******/ if (installedModules[moduleId]) {
      /******/ return installedModules[moduleId].exports;
      /******/
    } // Create a new module (and put it into the cache)
    /******/ /******/ var module = (installedModules[moduleId] = {
      /******/ i: moduleId,
      /******/ l: false,
      /******/ exports: {},
      /******/
    }); // Execute the module function
    /******/
    /******/ /******/ modules[moduleId].call(
      module.exports,
      module,
      module.exports,
      __webpack_require__,
    ); // Flag the module as loaded
    /******/
    /******/ /******/ module.l = true; // Return the exports of the module
    /******/
    /******/ /******/ return module.exports;
    /******/
  } // expose the modules object (__webpack_modules__)
  /******/
  /******/
  /******/ /******/ __webpack_require__.m = modules; // expose the module cache
  /******/
  /******/ /******/ __webpack_require__.c = installedModules; // define getter function for harmony exports
  /******/
  /******/ /******/ __webpack_require__.d = function(exports, name, getter) {
    /******/ if (!__webpack_require__.o(exports, name)) {
      /******/ Object.defineProperty(exports, name, {
        /******/ configurable: false,
        /******/ enumerable: true,
        /******/ get: getter,
        /******/
      });
      /******/
    }
    /******/
  }; // getDefaultExport function for compatibility with non-harmony modules
  /******/
  /******/ /******/ __webpack_require__.n = function(module) {
    /******/ var getter =
      module && module.__esModule
        ? /******/ function getDefault() {
            return module['default'];
          }
        : /******/ function getModuleExports() {
            return module;
          };
    /******/ __webpack_require__.d(getter, 'a', getter);
    /******/ return getter;
    /******/
  }; // Object.prototype.hasOwnProperty.call
  /******/
  /******/ /******/ __webpack_require__.o = function(object, property) {
    return Object.prototype.hasOwnProperty.call(object, property);
  }; // __webpack_public_path__
  /******/
  /******/ /******/ __webpack_require__.p = ''; // Load entry module and return exports
  /******/
  /******/ /******/ return __webpack_require__((__webpack_require__.s = 6));
  /******/
})(
  /************************************************************************/
  /******/ [
    /* 0 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';
      /* WEBPACK VAR INJECTION */ (function(global) {
        var _typeof =
          typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol'
            ? function(obj) {
                return typeof obj;
              }
            : function(obj) {
                return obj &&
                  typeof Symbol === 'function' &&
                  obj.constructor === Symbol &&
                  obj !== Symbol.prototype
                  ? 'symbol'
                  : typeof obj;
              };

        function emptyFunc() {}

        var performanceNow =
          (global.performance &&
            function() {
              return global.performance.now();
            }) ||
          function() {
            return Date.now();
          };
        var requestAnimationFrame =
          global.requestAnimationFrame ||
          function(callback) {
            return setTimeout(function() {
              return callback(performanceNow());
            }, 1000 / 60);
          };
        var cancelAnimationFrame = global.cancelAnimationFrame || clearTimeout;

        // Object.assign polyfill, because IE :/
        var assign =
          Object.assign ||
          function(target) {
            var overrideTarget = Object(target);

            for (
              var _len = arguments.length,
                overrides = Array(_len > 1 ? _len - 1 : 0),
                _key = 1;
              _key < _len;
              _key++
            ) {
              overrides[_key - 1] = arguments[_key];
            }

            overrides.forEach(function(override) {
              if (override != null) {
                for (var key in override) {
                  if (Object.prototype.hasOwnProperty.call(override, key)) {
                    overrideTarget[key] = override[key];
                  }
                }
              }
            });
            return overrideTarget;
          };

        function copyAndMergeDeep(base, override) {
          var output = assign({}, base);
          for (var key in override) {
            // eslint-disable-line guard-for-in
            // skipping hasOwnProperty check for performance reasons - we shouldn't be passing any objects
            // in here that aren't plain objects anyway and this is a hot code path
            var baseVal = base[key];
            var overrideVal = override[key];
            if (baseVal === overrideVal) continue; // eslint-disable-line no-continue
            if (
              baseVal &&
              overrideVal &&
              (typeof baseVal === 'undefined'
                ? 'undefined'
                : _typeof(baseVal)) === 'object' &&
              (typeof overrideVal === 'undefined'
                ? 'undefined'
                : _typeof(overrideVal)) === 'object' &&
              !Array.isArray(overrideVal)
            ) {
              output[key] = copyAndMergeDeep(baseVal, overrideVal);
            } else {
              output[key] = overrideVal;
            }
          }
          return output;
        }

        function inflate(scope, obj) {
          var parts = scope.split('.');
          var final = {};
          var current = final;
          for (var i = 0; i < parts.length; i++) {
            var cap = i === parts.length - 1 ? obj : {};
            current[parts[i]] = cap;
            current = cap;
          }
          return final;
        }

        // utils for classes without es6, sigh...
        // from: https://github.com/nodejs/node-v0.x-archive/blob/546ae2ee/lib/util.js#L552-L575
        function inherits(ctor, superCtor) {
          ctor.super_ = superCtor; // eslint-disable-line no-param-reassign
          ctor.prototype = Object.create(superCtor.prototype, {
            // eslint-disable-line no-param-reassign
            constructor: {
              value: ctor,
              enumerable: false,
              writable: true,
              configurable: true,
            },
          });
        }

        function arrayMax(numArray) {
          return Math.max.apply(null, numArray);
        }

        function arrayMin(numArray) {
          return Math.min.apply(null, numArray);
        }

        function getExtremes(numArray) {
          var max = arrayMax(numArray);
          var min = arrayMin(numArray);
          var mid = (max + min) / 2;
          return [max, mid, min];
        }

        function callIfExists(callback) {
          for (
            var _len2 = arguments.length,
              args = Array(_len2 > 1 ? _len2 - 1 : 0),
              _key2 = 1;
            _key2 < _len2;
            _key2++
          ) {
            args[_key2 - 1] = arguments[_key2];
          }

          if (callback) callback.apply(undefined, args);
        }

        var count = 0;
        function counter() {
          count++;
          return count;
        }

        function average(arr) {
          var sum = arr.reduce(function(acc, val) {
            return val + acc;
          }, 0);
          return sum / arr.length;
        }

        function timeout() {
          var duration =
            arguments.length > 0 && arguments[0] !== undefined
              ? arguments[0]
              : 0;

          return new Promise(function(resolve, reject) {
            setTimeout(resolve, duration);
          });
        }

        function isMSBrowser() {
          return (
            global.navigator &&
            global.navigator.userAgent &&
            (global.navigator.userAgent.indexOf('Edge') >= 0 ||
              global.navigator.userAgent.indexOf('MSIE') >= 0)
          );
        }

        // return a new array-like object with int keys where each key is item
        // ex: objRepeat({x: 8}, 3) === {0: {x: 8}, 1: {x: 8}, 2: {x: 8}}
        var objRepeat = function objRepeat(item, times) {
          var obj = {};
          for (var i = 0; i < times; i++) {
            obj[i] = item;
          }
          return obj;
        };

        module.exports = {
          arrayMax: arrayMax,
          arrayMin: arrayMin,
          assign: assign,
          average: average,
          callIfExists: callIfExists,
          cancelAnimationFrame: cancelAnimationFrame,
          copyAndMergeDeep: copyAndMergeDeep,
          counter: counter,
          emptyFunc: emptyFunc,
          getExtremes: getExtremes,
          inflate: inflate,
          inherits: inherits,
          isMSBrowser: isMSBrowser,
          objRepeat: objRepeat,
          performanceNow: performanceNow,
          requestAnimationFrame: requestAnimationFrame,
          timeout: timeout,
        };
        /* WEBPACK VAR INJECTION */
      }.call(exports, __webpack_require__(2)));

      /***/
    },
    /* 1 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';

      var _slicedToArray = (function() {
        function sliceIterator(arr, i) {
          var _arr = [];
          var _n = true;
          var _d = false;
          var _e = undefined;
          try {
            for (
              var _i = arr[Symbol.iterator](), _s;
              !(_n = (_s = _i.next()).done);
              _n = true
            ) {
              _arr.push(_s.value);
              if (i && _arr.length === i) break;
            }
          } catch (err) {
            _d = true;
            _e = err;
          } finally {
            try {
              if (!_n && _i['return']) _i['return']();
            } finally {
              if (_d) throw _e;
            }
          }
          return _arr;
        }
        return function(arr, i) {
          if (Array.isArray(arr)) {
            return arr;
          } else if (Symbol.iterator in Object(arr)) {
            return sliceIterator(arr, i);
          } else {
            throw new TypeError(
              'Invalid attempt to destructure non-iterable instance',
            );
          }
        };
      })();

      var _require = __webpack_require__(0),
        arrayMin = _require.arrayMin,
        arrayMax = _require.arrayMax;

      function Point(x, y) {
        this.x = parseFloat(x, 10);
        this.y = parseFloat(y, 10);
      }

      // return a new point subtracting point from this
      Point.prototype.subtract = function(point) {
        return new Point(this.x - point.x, this.y - point.y);
      };

      // return a new point adding point from this
      Point.prototype.add = function(point) {
        return new Point(this.x + point.x, this.y + point.y);
      };

      Point.prototype.getMagnitude = function() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
      };

      Point.prototype.equals = function(point) {
        if (!point) return false;
        return point.x === this.x && point.y === this.y;
      };

      Point.getBounds = function(points) {
        var xs = points.map(function(point) {
          return point.x;
        });
        var ys = points.map(function(point) {
          return point.y;
        });
        var maxX = arrayMax(xs);
        var maxY = arrayMax(ys);
        var minX = arrayMin(xs);
        var minY = arrayMin(ys);
        return [new Point(minX, minY), new Point(maxX, maxY)];
      };

      // boundable here refers to any object with a getBounds() method
      Point.getOverallBounds = function(boundables) {
        var bounds = [];
        boundables.forEach(function(boundable) {
          var _boundable$getBounds = boundable.getBounds(),
            _boundable$getBounds2 = _slicedToArray(_boundable$getBounds, 2),
            lowerBound = _boundable$getBounds2[0],
            upperBound = _boundable$getBounds2[1];

          bounds.push(lowerBound);
          bounds.push(upperBound);
        });
        return Point.getBounds(bounds);
      };

      Point.getDistance = function(point1, point2) {
        var difference = point1.subtract(point2);
        return difference.getMagnitude();
      };

      Point.cosineSimilarity = function(point1, point2) {
        var rawDotProduct = point1.x * point2.x + point1.y * point2.y;
        return rawDotProduct / point1.getMagnitude() / point2.getMagnitude();
      };

      module.exports = Point;

      /***/
    },
    /* 2 */
    /***/ function(module, exports) {
      var g;

      // This works in non-strict mode
      g = (function() {
        return this;
      })();

      try {
        // This works if eval is allowed (see CSP)
        g = g || Function('return this')() || (1, eval)('this');
      } catch (e) {
        // This works if the window reference is available
        if (typeof window === 'object') g = window;
      }

      // g can still be undefined, but nothing to do about it...
      // We return undefined, instead of nothing here, so it's
      // easier to handle this case. if(!global) { ...}

      module.exports = g;

      /***/
    },
    /* 3 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';
      /* WEBPACK VAR INJECTION */ (function(global) {
        function removeElm(elm) {
          if (elm) elm.parentNode.removeChild(elm);
        }

        function initDiv(elmOrId) {
          var elm = elmOrId;
          if (typeof elmOrId === 'string') {
            elm = global.document.getElementById(elmOrId);
          }

          var div = global.document.createElement('div');
          div.style.width = '100%';
          div.style.height = '100%';
          div.style.position = 'relative';
          elm.appendChild(div);
          return div;
        }

        var drawPath = function drawPath(ctx, points) {
          ctx.beginPath();
          var start = points[0];
          var remainingPoints = points.slice(1);
          ctx.moveTo(start.x, start.y);
          remainingPoints.forEach(function(point) {
            ctx.lineTo(point.x, point.y);
          });
        };

        module.exports = {
          initDiv: initDiv,
          removeElm: removeElm,
          drawPath: drawPath,
        };
        /* WEBPACK VAR INJECTION */
      }.call(exports, __webpack_require__(2)));

      /***/
    },
    /* 4 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';

      function _defineProperty(obj, key, value) {
        if (key in obj) {
          Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true,
          });
        } else {
          obj[key] = value;
        }
        return obj;
      }

      var Mutation = __webpack_require__(5);

      var _require = __webpack_require__(0),
        objRepeat = _require.objRepeat;

      var hideStrokes = function hideStrokes(charName, character, duration) {
        return [
          new Mutation(
            'character.' + charName + '.strokes',
            objRepeat({ opacity: 0 }, character.strokes.length),
            { duration: duration, force: true },
          ),
        ];
      };

      var showStrokes = function showStrokes(charName, character, duration) {
        return [
          new Mutation(
            'character.' + charName + '.strokes',
            objRepeat(
              { opacity: 1, displayPortion: 1 },
              character.strokes.length,
            ),
            { duration: duration, force: true },
          ),
        ];
      };

      var showCharacter = function showCharacter(
        charName,
        character,
        duration,
      ) {
        return [
          new Mutation(
            'character.' + charName,
            {
              opacity: 1,
              strokes: objRepeat(
                { opacity: 1, displayPortion: 1 },
                character.strokes.length,
              ),
            },
            { duration: duration, force: true },
          ),
        ];
      };

      var hideCharacter = function hideCharacter(
        charName,
        character,
        duration,
      ) {
        return [
          new Mutation('character.' + charName + '.opacity', 0, {
            duration: duration,
            force: true,
          }),
        ].concat(showStrokes(charName, character, 0));
      };

      var animateStroke = function animateStroke(charName, stroke, speed) {
        var strokeNum = stroke.strokeNum;
        var duration = (stroke.getLength() + 600) / (3 * speed);
        return [
          new Mutation('character.' + charName, {
            opacity: 1,
            strokes: _defineProperty({}, strokeNum, {
              displayPortion: 0,
              opacity: 1,
            }),
          }),
          new Mutation(
            'character.' +
              charName +
              '.strokes.' +
              strokeNum +
              '.displayPortion',
            1,
            { duration: duration },
          ),
        ];
      };

      var highlightStroke = function highlightStroke(charName, stroke, speed) {
        var strokeNum = stroke.strokeNum;
        var duration = (stroke.getLength() + 600) / (3 * speed);
        return [
          new Mutation('character.' + charName, {
            opacity: 1,
            strokes: _defineProperty({}, strokeNum, {
              displayPortion: 0,
              opacity: 0,
            }),
          }),
          new Mutation(
            'character.' + charName + '.strokes.' + strokeNum,
            {
              displayPortion: 1,
              opacity: 1,
            },
            { duration: duration },
          ),
          new Mutation(
            'character.' + charName + '.strokes.' + strokeNum + '.opacity',
            0,
            { duration: duration },
          ),
        ];
      };

      var showStroke = function showStroke(charName, strokeNum, duration) {
        return [
          new Mutation(
            'character.' + charName,
            {
              opacity: 1,
              strokes: _defineProperty({}, strokeNum, {
                displayPortion: 1,
                opacity: 1,
              }),
            },
            { duration: duration },
          ),
        ];
      };

      var animateCharacter = function animateCharacter(
        charName,
        character,
        fadeDuration,
        speed,
        delayBetweenStrokes,
      ) {
        var mutations = hideCharacter(charName, character, fadeDuration);
        mutations = mutations.concat(showStrokes(charName, character, 0));
        mutations.push(
          new Mutation(
            'character.' + charName,
            {
              opacity: 1,
              strokes: objRepeat({ opacity: 0 }, character.strokes.length),
            },
            { force: true },
          ),
        );
        character.strokes.forEach(function(stroke, i) {
          if (i > 0) mutations.push(new Mutation.Pause(delayBetweenStrokes));
          mutations = mutations.concat(animateStroke(charName, stroke, speed));
        });
        return mutations;
      };

      var animateCharacterLoop = function animateCharacterLoop(
        charName,
        character,
        fadeDuration,
        speed,
        delayBetweenStrokes,
        delayBetweenLoops,
      ) {
        var mutations = animateCharacter(
          charName,
          character,
          fadeDuration,
          speed,
          delayBetweenStrokes,
        );
        mutations.push(new Mutation.Pause(delayBetweenLoops));
        return mutations;
      };

      module.exports = {
        showStrokes: showStrokes,
        hideStrokes: hideStrokes,
        showCharacter: showCharacter,
        hideCharacter: hideCharacter,
        animateCharacter: animateCharacter,
        animateCharacterLoop: animateCharacterLoop,
        animateStroke: animateStroke,
        highlightStroke: highlightStroke,
        showStroke: showStroke,
      };

      /***/
    },
    /* 5 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';

      var _require = __webpack_require__(0),
        inflate = _require.inflate,
        performanceNow = _require.performanceNow,
        requestAnimationFrame = _require.requestAnimationFrame,
        cancelAnimationFrame = _require.cancelAnimationFrame;

      // ------ Mutation class --------

      var getPartialValues = function getPartialValues(
        startValues,
        endValues,
        progress,
      ) {
        var target = {};
        for (var key in endValues) {
          // eslint-disable-line guard-for-in
          // skipping hasOwnProperty check for performance reasons - we shouldn't be passing any objects
          // in here that aren't plain objects anyway and this is a hot code path
          var endValue = endValues[key];
          var startValue = startValues[key];
          if (endValue >= 0) {
            target[key] = progress * (endValue - startValue) + startValue;
          } else {
            target[key] = getPartialValues(startValue, endValue, progress);
          }
        }
        return target;
      };

      var isAlreadyAtEnd = function isAlreadyAtEnd(startValues, endValues) {
        for (var key in endValues) {
          if (endValues.hasOwnProperty(key)) {
            var endValue = endValues[key];
            var startValue = startValues[key];
            if (endValue >= 0) {
              if (endValue !== startValue) return false;
            } else if (!isAlreadyAtEnd(startValue, endValue)) {
              return false;
            }
          }
        }
        return true;
      };

      // from https://github.com/maxwellito/vivus
      var ease = function ease(x) {
        return -Math.cos(x * Math.PI) / 2 + 0.5;
      };

      function Mutation(scope, values) {
        var options =
          arguments.length > 2 && arguments[2] !== undefined
            ? arguments[2]
            : {};

        this.scope = scope;
        this._values = inflate(scope, values);
        this._duration = options.duration || 0;
        this._force = options.force;
        this._tickBound = this._tick.bind(this);
      }

      Mutation.prototype.run = function(renderState) {
        var _this = this;

        if (this._duration === 0) renderState.updateState(this._values);
        if (
          this._duration === 0 ||
          isAlreadyAtEnd(renderState.state, this._values)
        ) {
          return Promise.resolve();
        }
        this._renderState = renderState;
        this._startState = renderState.state;
        this._startTime = performanceNow();
        this._frameHandle = requestAnimationFrame(this._tickBound);
        return new Promise(function(resolve) {
          _this._resolve = resolve;
        });
      };

      Mutation.prototype._tick = function(timing) {
        var progress = Math.min(1, (timing - this._startTime) / this._duration);
        if (progress === 1) {
          this._renderState.updateState(this._values);
          this._frameHandle = null;
          this.cancel(this._renderState);
        } else {
          var easedProgress = ease(progress);
          this._renderState.updateState(
            getPartialValues(this._startState, this._values, easedProgress),
          );
          this._frameHandle = requestAnimationFrame(this._tickBound);
        }
      };

      Mutation.prototype.cancel = function(renderState) {
        if (this._resolve) this._resolve();
        this._resolve = null;
        if (this._frameHandle) cancelAnimationFrame(this._frameHandle);
        this._frameHandle = null;
        if (this._force) renderState.updateState(this._values);
      };

      // ------ Mutation.Pause Class --------

      function Pause(duration) {
        this._duration = duration;
      }

      Pause.prototype.run = function() {
        var _this2 = this;

        var timeoutPromise = new Promise(function(resolve) {
          _this2._resolve = resolve;
        });
        this._timeout = setTimeout(function() {
          return _this2.cancel();
        }, this._duration);
        return timeoutPromise;
      };

      Pause.prototype.cancel = function() {
        clearTimeout(this._timeout);
        if (this._resolve) this._resolve();
        this._resolve = false;
      };

      Mutation.Pause = Pause;

      // -------------------------------------

      module.exports = Mutation;

      /***/
    },
    /* 6 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';
      /* WEBPACK VAR INJECTION */ (function(global) {
        var HanziWriterRenderer = __webpack_require__(7);
        var RenderState = __webpack_require__(12);
        var Point = __webpack_require__(1);
        var CharDataParser = __webpack_require__(13);
        var Positioner = __webpack_require__(16);
        var Quiz = __webpack_require__(17);
        var dom = __webpack_require__(3);
        var defaultCharDataLoader = __webpack_require__(21);
        var LoadingManager = __webpack_require__(22);
        var characterActions = __webpack_require__(4);

        var _require = __webpack_require__(0),
          assign = _require.assign,
          callIfExists = _require.callIfExists;

        var defaultOptions = {
          charDataLoader: defaultCharDataLoader,
          onLoadCharDataError: null,
          onLoadCharDataSuccess: null,
          showOutline: true,
          showCharacter: true,

          // positioning options

          width: null,
          height: null,
          padding: 20,

          // animation options

          strokeAnimationSpeed: 1,
          strokeFadeDuration: 400,
          strokeHighlightDuration: 200,
          strokeHighlightSpeed: 2,
          delayBetweenStrokes: 1000,
          delayBetweenLoops: 2000,

          // colors

          strokeColor: '#555',
          radicalColor: null,
          highlightColor: '#AAF',
          outlineColor: '#DDD',
          drawingColor: '#333',

          // quiz options

          showHintAfterMisses: 3,
          highlightOnComplete: true,

          // undocumented obscure options

          drawingFadeDuration: 300,
          drawingWidth: 4,
          strokeWidth: 2,
          outlineWidth: 2,
        };

        function HanziWriter(element, character) {
          var options =
            arguments.length > 2 && arguments[2] !== undefined
              ? arguments[2]
              : {};

          this._target = dom.initDiv(element);
          this._options = this._assignOptions(options);
          this._loadingManager = new LoadingManager(this._options);
          this.setCharacter(character);
          this._setupListeners();
          this._quiz = null;
        }

        // ------ public API ------ //

        HanziWriter.prototype.showCharacter = function() {
          var _this = this;

          var options =
            arguments.length > 0 && arguments[0] !== undefined
              ? arguments[0]
              : {};

          return this._withData(function() {
            return _this._renderState
              .run(
                characterActions.showCharacter(
                  'main',
                  _this._character,
                  options.duration || _this._options.strokeFadeDuration,
                ),
              )
              .then(function() {
                return callIfExists(options.onComplete);
              });
          });
        };
        HanziWriter.prototype.hideCharacter = function() {
          var _this2 = this;

          var options =
            arguments.length > 0 && arguments[0] !== undefined
              ? arguments[0]
              : {};

          return this._withData(function() {
            return _this2._renderState
              .run(
                characterActions.hideCharacter(
                  'main',
                  _this2._character,
                  options.duration || _this2._options.strokeFadeDuration,
                ),
              )
              .then(function() {
                return callIfExists(options.onComplete);
              });
          });
        };
        HanziWriter.prototype.animateCharacter = function() {
          var _this3 = this;

          var options =
            arguments.length > 0 && arguments[0] !== undefined
              ? arguments[0]
              : {};

          this.cancelQuiz();
          return this._withData(function() {
            return _this3._renderState
              .run(
                characterActions.animateCharacter(
                  'main',
                  _this3._character,
                  _this3._options.strokeFadeDuration,
                  _this3._options.strokeAnimationSpeed,
                  _this3._options.delayBetweenStrokes,
                ),
              )
              .then(function() {
                return callIfExists(options.onComplete);
              });
          });
        };
        HanziWriter.prototype.loopCharacterAnimation = function() {
          var _this4 = this;

          var options =
            arguments.length > 0 && arguments[0] !== undefined
              ? arguments[0]
              : {};

          this.cancelQuiz();
          return this._withData(function() {
            return _this4._renderState.run(
              characterActions.animateCharacterLoop(
                'main',
                _this4._character,
                _this4._options.strokeFadeDuration,
                _this4._options.strokeAnimationSpeed,
                _this4._options.delayBetweenStrokes,
                _this4._options.delayBetweenLoops,
              ),
              { loop: true },
            );
          });
        };

        HanziWriter.prototype.showOutline = function() {
          var _this5 = this;

          var options =
            arguments.length > 0 && arguments[0] !== undefined
              ? arguments[0]
              : {};

          return this._withData(function() {
            return _this5._renderState
              .run(
                characterActions.showCharacter(
                  'outline',
                  _this5._character,
                  options.duration || _this5._options.strokeFadeDuration,
                ),
              )
              .then(function() {
                return callIfExists(options.onComplete);
              });
          });
        };

        HanziWriter.prototype.hideOutline = function() {
          var _this6 = this;

          var options =
            arguments.length > 0 && arguments[0] !== undefined
              ? arguments[0]
              : {};

          return this._withData(function() {
            return _this6._renderState
              .run(
                characterActions.hideCharacter(
                  'outline',
                  _this6._character,
                  options.duration || _this6._options.strokeFadeDuration,
                ),
              )
              .then(function() {
                return callIfExists(options.onComplete);
              });
          });
        };

        HanziWriter.prototype.quiz = function() {
          var _this7 = this;

          var quizOptions =
            arguments.length > 0 && arguments[0] !== undefined
              ? arguments[0]
              : {};

          this._withData(function() {
            _this7.cancelQuiz();
            _this7._quiz = new Quiz(_this7._character, _this7._renderState);
            _this7._quiz.startQuiz(assign({}, _this7._options, quizOptions));
          });
        };

        HanziWriter.prototype.cancelQuiz = function() {
          if (this._quiz) this._quiz.cancel();
        };

        HanziWriter.prototype.setCharacter = function(char) {
          var _this8 = this;

          this.cancelQuiz();
          this._char = char;
          if (this._hanziWriterRenderer) this._hanziWriterRenderer.destroy();
          this._hanziWriterRenderer = null;
          this._withDataPromise = this._loadingManager
            .loadCharData(char)
            .then(function(pathStrings) {
              if (_this8._loadingManager.loadingFailed) return;

              var charDataParser = new CharDataParser();
              _this8._character = charDataParser.generateCharacter(
                char,
                pathStrings,
              );
              _this8._positioner = new Positioner(
                _this8._character,
                _this8._options,
              );
              _this8._hanziWriterRenderer = new HanziWriterRenderer(
                _this8._character,
                _this8._positioner,
              );
              _this8._renderState = new RenderState(
                _this8._character,
                _this8._options,
                function(nextState) {
                  _this8._hanziWriterRenderer.render(nextState);
                },
              );
              _this8._hanziWriterRenderer.mount(
                _this8._target,
                _this8._renderState.state,
              );
              _this8._hanziWriterRenderer.render(_this8._renderState.state);
            });
          return this._withDataPromise;
        };

        // ------------- //

        HanziWriter.prototype._assignOptions = function(options) {
          var mergedOptions = assign({}, defaultOptions, options);

          // backfill strokeAnimationSpeed if deprecated strokeAnimationDuration is provided instead
          if (
            options.strokeAnimationDuration &&
            !options.strokeAnimationSpeed
          ) {
            mergedOptions.strokeAnimationSpeed =
              500 / mergedOptions.strokeAnimationDuration;
          }
          if (
            options.strokeHighlightDuration &&
            !options.strokeHighlightSpeed
          ) {
            mergedOptions.strokeHighlightSpeed =
              500 / mergedOptions.strokeHighlightDuration;
          }

          return this._fillWidthAndHeight(mergedOptions);
        };

        // returns a new options object with width and height filled in if missing
        HanziWriter.prototype._fillWidthAndHeight = function(options) {
          var filledOpts = assign({}, options);
          if (filledOpts.width && !filledOpts.height) {
            filledOpts.height = filledOpts.width;
          } else if (filledOpts.height && !filledOpts.width) {
            filledOpts.width = filledOpts.height;
          } else if (!filledOpts.width && !filledOpts.height) {
            var _target$getBoundingCl = this._target.getBoundingClientRect(),
              width = _target$getBoundingCl.width,
              height = _target$getBoundingCl.height;

            var minDim = Math.min(width, height);
            filledOpts.width = minDim;
            filledOpts.height = minDim;
          }
          return filledOpts;
        };

        HanziWriter.prototype._withData = function(func) {
          var _this9 = this;

          // if this._loadingManager.loadingFailed, then loading failed before this method was called
          // Try reloading again and see if it helps
          if (this._loadingManager.loadingFailed) {
            this.setCharacter(this._char);
            return Promise.resolve().then(function() {
              // check loadingFailed again just in case setCharacter fails synchronously
              if (!_this9._loadingManager.loadingFailed) {
                return _this9._withData(func);
              }
            });
          }
          return this._withDataPromise.then(function() {
            if (!_this9._loadingManager.loadingFailed) {
              return func();
            }
          });
        };

        HanziWriter.prototype._setupListeners = function() {
          var _this10 = this;

          this._target.addEventListener('mousedown', function(evt) {
            if (_this10.isLoadingCharData || !_this10._quiz) return;
            evt.preventDefault();
            _this10._forwardToQuiz(
              'startUserStroke',
              _this10._getMousePoint(evt),
            );
          });
          this._target.addEventListener('touchstart', function(evt) {
            if (_this10.isLoadingCharData || !_this10._quiz) return;
            evt.preventDefault();
            _this10._forwardToQuiz(
              'startUserStroke',
              _this10._getTouchPoint(evt),
            );
          });
          this._target.addEventListener('mousemove', function(evt) {
            if (_this10.isLoadingCharData || !_this10._quiz) return;
            evt.preventDefault();
            _this10._forwardToQuiz(
              'continueUserStroke',
              _this10._getMousePoint(evt),
            );
          });
          this._target.addEventListener('touchmove', function(evt) {
            if (_this10.isLoadingCharData || !_this10._quiz) return;
            evt.preventDefault();
            _this10._forwardToQuiz(
              'continueUserStroke',
              _this10._getTouchPoint(evt),
            );
          });

          // TODO: fix
          global.document.addEventListener('mouseup', function() {
            return _this10._forwardToQuiz('endUserStroke');
          });
          global.document.addEventListener('touchend', function() {
            return _this10._forwardToQuiz('endUserStroke');
          });
        };

        HanziWriter.prototype._forwardToQuiz = function(method) {
          var _quiz;

          if (!this._quiz) return;

          for (
            var _len = arguments.length,
              args = Array(_len > 1 ? _len - 1 : 0),
              _key = 1;
            _key < _len;
            _key++
          ) {
            args[_key - 1] = arguments[_key];
          }

          (_quiz = this._quiz)[method].apply(_quiz, args);
        };

        HanziWriter.prototype._getMousePoint = function(evt) {
          var box = this._target.getBoundingClientRect();
          return this._positioner.convertExternalPoint(
            new Point(evt.clientX - box.left, evt.clientY - box.top),
          );
        };

        HanziWriter.prototype._getTouchPoint = function(evt) {
          var box = this._target.getBoundingClientRect();
          var x = evt.touches[0].clientX - box.left;
          var y = evt.touches[0].clientY - box.top;
          return this._positioner.convertExternalPoint(new Point(x, y));
        };

        // set up window.HanziWriter if we're in the browser
        if (typeof global.window !== 'undefined') {
          // store whatever used to be called HanziWriter in case of a conflict
          var previousHanziWriter = global.window.HanziWriter;

          // add a jQuery-esque noConflict method to restore the previous global.window.HanziWriter if necessary
          HanziWriter.noConflict = function() {
            global.window.HanziWriter = previousHanziWriter;
            return HanziWriter;
          };

          global.window.HanziWriter = HanziWriter;
        }

        // set up module.exports if we're in node/webpack
        if (true) {
          module.exports = HanziWriter;
        }
        /* WEBPACK VAR INJECTION */
      }.call(exports, __webpack_require__(2)));

      /***/
    },
    /* 7 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';
      /* WEBPACK VAR INJECTION */ (function(global) {
        var CharacterRenderer = __webpack_require__(8);
        var UserStrokeRenderer = __webpack_require__(11);

        var _require = __webpack_require__(0),
          assign = _require.assign;

        var extractCharProps = function extractCharProps(props, charName) {
          return assign(
            { strokeWidth: props.options.strokeWidth },
            props.character[charName],
          );
        };

        function HanziWriterRenderer(character, positioner) {
          this._character = character;
          this._positioner = positioner;
          this._mainCharRenderer = new CharacterRenderer(character, positioner);
          this._outlineCharRenderer = new CharacterRenderer(
            character,
            positioner,
          );
          this._highlightCharRenderer = new CharacterRenderer(
            character,
            positioner,
          );
          this._userStrokeRenderers = {};

          this._width = this._positioner.getWidth();
          this._height = this._positioner.getHeight();
          this._transX = this._positioner.getXOffset();
          this._transY =
            this._positioner.getHeight() - this._positioner.getYOffset();
          this._scale = this._positioner.getScale();
        }

        HanziWriterRenderer.prototype.mount = function(target) {
          this._outlineCanvas = this._createPositionedCanvas(target);
          this._mainCanvas = this._createPositionedCanvas(target);
          this._highlightCanvas = this._createPositionedCanvas(target);
          this._userStrokesCanvas = this._createPositionedCanvas(target);

          this._outlineCharRenderer.mount(this._outlineCanvas);
          this._mainCharRenderer.mount(this._mainCanvas);
          this._highlightCharRenderer.mount(this._highlightCanvas);
        };

        HanziWriterRenderer.prototype._createPositionedCanvas = function(
          target,
        ) {
          var canvas = global.document.createElement('canvas');
          canvas.setAttribute('width', this._width);
          canvas.setAttribute('height', this._height);
          canvas.style.position = 'absolute';
          canvas.style.top = 0;
          canvas.style.left = 0;
          target.appendChild(canvas);
          return canvas;
        };

        HanziWriterRenderer.prototype._animationFrame = function(canvas, func) {
          var ctx = canvas.getContext('2d');
          ctx.clearRect(0, 0, this._width, this._height);

          ctx.save();
          ctx.globalCompositeOperation = 'destination-over';
          ctx.translate(this._transX, this._transY);
          ctx.scale(this._scale, -1 * this._scale);
          func(ctx);
          ctx.restore();
        };

        HanziWriterRenderer.prototype.render = function(props) {
          var _this = this;

          this._animationFrame(this._outlineCanvas, function(ctx) {
            _this._outlineCharRenderer.render(
              ctx,
              extractCharProps(props, 'outline'),
            );
          });
          this._animationFrame(this._mainCanvas, function(ctx) {
            _this._mainCharRenderer.render(
              ctx,
              extractCharProps(props, 'main'),
            );
          });
          this._animationFrame(this._highlightCanvas, function(ctx) {
            _this._highlightCharRenderer.render(
              ctx,
              extractCharProps(props, 'highlight'),
            );
          });

          this._animationFrame(this._userStrokesCanvas, function(ctx) {
            var userStrokes = props.userStrokes || {};
            Object.keys(_this._userStrokeRenderers).forEach(function(
              userStrokeId,
            ) {
              if (!userStrokes[userStrokeId]) {
                delete _this._userStrokeRenderers[userStrokeId];
              }
            });

            Object.keys(userStrokes).forEach(function(userStrokeId) {
              if (!userStrokes[userStrokeId]) return;
              var userStrokeProps = assign(
                {
                  strokeWidth: props.options.drawingWidth,
                  strokeColor: props.options.drawingColor,
                },
                userStrokes[userStrokeId],
              );
              var strokeRenderer = _this._userStrokeRenderers[userStrokeId];
              if (!strokeRenderer) {
                strokeRenderer = new UserStrokeRenderer();
                _this._userStrokeRenderers[userStrokeId] = strokeRenderer;
              }
              strokeRenderer.render(ctx, userStrokeProps);
            });
          });
        };

        HanziWriterRenderer.prototype.destroy = function() {
          this._outlineCharRenderer.destroy();
          this._mainCharRenderer.destroy();
          this._highlightCharRenderer.destroy();
        };

        module.exports = HanziWriterRenderer;
        /* WEBPACK VAR INJECTION */
      }.call(exports, __webpack_require__(2)));

      /***/
    },
    /* 8 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';

      var StrokeRenderer = __webpack_require__(9);
      var dom = __webpack_require__(3);

      function CharacterRenderer(character) {
        this._oldProps = {};
        this._character = character;
        this.strokeRenderers = this._character.strokes.map(function(stroke) {
          return new StrokeRenderer(stroke);
        });
      }

      CharacterRenderer.prototype.mount = function(canvas) {
        this._canvas = canvas;
      };

      CharacterRenderer.prototype.render = function(ctx, props) {
        if (props.opacity !== this._oldProps.opacity) {
          this._canvas.style.opacity = props.opacity;
        }

        for (var i = 0; i < this.strokeRenderers.length; i++) {
          this.strokeRenderers[i].render(ctx, {
            usePolygonMasks: props.usePolygonMasks,
            strokeColor: props.strokeColor,
            radicalColor: props.radicalColor,
            strokeWidth: props.strokeWidth,
            opacity: props.strokes[i].opacity,
            displayPortion: props.strokes[i].displayPortion,
          });
        }

        this._oldProps = props;
      };

      CharacterRenderer.prototype.destroy = function() {
        dom.removeElm(this._canvas);
      };

      module.exports = CharacterRenderer;

      /***/
    },
    /* 9 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';
      /* WEBPACK VAR INJECTION */ (function(global) {
        var _require = __webpack_require__(10),
          extendPointOnLine = _require.extendPointOnLine,
          getLineSegmentsPortion = _require.getLineSegmentsPortion,
          filterParallelPoints = _require.filterParallelPoints,
          linesToPolygon = _require.linesToPolygon;

        var _require2 = __webpack_require__(3),
          drawPath = _require2.drawPath;

        var STROKE_WIDTH = 200;

        // take points on a path and move their start point backwards by distance
        var extendStart = function extendStart(points, distance) {
          if (points.length < 2) return points;
          var p1 = points[1];
          var p2 = points[0];
          var newStart = extendPointOnLine(p1, p2, distance);
          var extendedPoints = points.slice(1);
          extendedPoints.unshift(newStart);
          return extendedPoints;
        };

        // take points on a path and move their end point backwards by distance
        var extendEnd = function extendEnd(points, distance) {
          if (points.length < 2) return points;
          var p1 = points[points.length - 2];
          var p2 = points[points.length - 1];
          var newEnd = extendPointOnLine(p1, p2, distance);
          var extendedPoints = points.slice(0, points.length - 1);
          extendedPoints.push(newEnd);
          return extendedPoints;
        };

        // this is a stroke composed of several stroke parts
        function StrokeRenderer(stroke) {
          this._oldProps = {};
          this._stroke = stroke;
          this._maskPathLength = stroke.getLength() + STROKE_WIDTH / 2;
          var extendedStartPoints = extendStart(
            filterParallelPoints(this._stroke.points),
            STROKE_WIDTH / 2,
          );
          this._extendedMaskPoints = extendEnd(
            extendedStartPoints,
            STROKE_WIDTH / 2,
          );

          this.path2D = new global.Path2D(this._stroke.path);
        }

        StrokeRenderer.prototype.render = function(ctx, props) {
          ctx.save();

          var strokePointsPortion = getLineSegmentsPortion(
            this._extendedMaskPoints,
            props.displayPortion,
          );
          var clipPathPoints = linesToPolygon(
            strokePointsPortion,
            STROKE_WIDTH,
          );

          drawPath(ctx, clipPathPoints);
          ctx.clip();

          var color = this._getColor(props);
          ctx.globalAlpha = props.opacity;
          ctx.fillStyle = color;
          ctx.strokeStyle = color;
          ctx.lineWidth = props.strokeWidth;
          ctx.fill(this.path2D);
          ctx.stroke(this.path2D);

          ctx.restore();
        };

        StrokeRenderer.prototype._getStrokeDashoffset = function(
          displayPortion,
        ) {
          return this._maskPathLength * 0.999 * (1 - displayPortion);
        };

        StrokeRenderer.prototype._getColor = function(_ref) {
          var strokeColor = _ref.strokeColor,
            radicalColor = _ref.radicalColor;

          return radicalColor && this._stroke.isInRadical
            ? radicalColor
            : strokeColor;
        };

        module.exports = StrokeRenderer;
        /* WEBPACK VAR INJECTION */
      }.call(exports, __webpack_require__(2)));

      /***/
    },
    /* 10 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';

      var Point = __webpack_require__(1);

      // return a new point, p3, which is on the same line as p1 and p2, but distance away
      // from p2. p1, p2, p3 will always lie on the line in that order
      var extendPointOnLine = function extendPointOnLine(p1, p2, distance) {
        var vect = p2.subtract(p1);
        var norm = distance / vect.getMagnitude();
        return new Point(p2.x + norm * vect.x, p2.y + norm * vect.y);
      };

      // return 2 points distance from targetPoint on line perpendicular to the line between
      // targetPoint and refPoint
      var getPerpendicularPointsAtDist = function getPerpendicularPointsAtDist(
        targetPoint,
        refPoint,
        distance,
      ) {
        var vect = targetPoint.subtract(refPoint);
        var norm = distance / vect.getMagnitude();
        // simulate taking a cross-product with the vector (0, 0, 1) to get the new perpendicular vect
        var perpVect = new Point(norm * vect.y, -1 * norm * vect.x);
        return [targetPoint.add(perpVect), targetPoint.subtract(perpVect)];
      };

      // get the intersection point of 2 lines defined by 2 points each
      // from https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection
      var getLinesIntersectPoint = function getLinesIntersectPoint(
        l1p1,
        l1p2,
        l2p1,
        l2p2,
      ) {
        var x1 = l1p1.x;
        var x2 = l1p2.x;
        var x3 = l2p1.x;
        var x4 = l2p2.x;
        var y1 = l1p1.y;
        var y2 = l1p2.y;
        var y3 = l2p1.y;
        var y4 = l2p2.y;
        var xNumerator =
          (x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4);
        var yNumerator =
          (x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4);
        var denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
        return new Point(xNumerator / denominator, yNumerator / denominator);
      };

      var getLineSegmentsLength = function getLineSegmentsLength(points) {
        var totalDist = 0;
        for (var i = 1; i < points.length; i++) {
          totalDist += Point.getDistance(points[i], points[i - 1]);
        }
        return totalDist;
      };

      var getLineSegmentsPortion = function getLineSegmentsPortion(
        points,
        portion,
      ) {
        if (points.length < 2 || portion >= 1) return points;
        if (portion === 0) return [points[0]];
        var totalDist = getLineSegmentsLength(points);
        var portionedPoints = [points[0]];
        var portionedDist = totalDist * portion;
        var cumuativeDist = 0;
        for (var i = 1; i < points.length; i++) {
          var lastPoint = points[i - 1];
          var segmentLength = Point.getDistance(points[i], lastPoint);
          if (cumuativeDist + segmentLength >= portionedDist) {
            var vect = points[i].subtract(lastPoint);
            var norm = (portionedDist - cumuativeDist) / segmentLength;
            portionedPoints.push(
              new Point(
                lastPoint.x + norm * vect.x,
                lastPoint.y + norm * vect.y,
              ),
            );
            return portionedPoints;
          }
          cumuativeDist += segmentLength;
          portionedPoints.push(points[i]);
        }
        return portionedPoints;
      };

      // remove intermediate points that are on the same line as the points to either side
      var filterParallelPoints = function filterParallelPoints(points) {
        if (points.length < 3) return points;
        var filteredPoints = [points[0], points[1]];
        points.slice(2).forEach(function(point, i) {
          var numFilteredPoints = filteredPoints.length;
          var curVect = point.subtract(filteredPoints[numFilteredPoints - 1]);
          var prevVect = filteredPoints[numFilteredPoints - 1].subtract(
            filteredPoints[numFilteredPoints - 2],
          );
          // this is the z coord of the cross-product. If this is 0 then they're parallel
          var isParallel =
            curVect.y * prevVect.x - curVect.x * prevVect.y === 0;
          if (isParallel) {
            filteredPoints.pop();
          }
          filteredPoints.push(point);
        });
        return filteredPoints;
      };

      // given the points of a polyline, return the points outlining a polygon that's that polyline stroked with thickness
      var linesToPolygon = function linesToPolygon(points, thickness) {
        if (points.length < 2) return points;
        var dist = thickness / 2;
        var topSegments = [];
        var bottomSegments = [];
        for (var i = 1; i < points.length; i++) {
          var startPoints = getPerpendicularPointsAtDist(
            points[i - 1],
            points[i],
            dist,
          );
          var endPoints = getPerpendicularPointsAtDist(
            points[i],
            points[i - 1],
            dist,
          );
          topSegments.push({ start: startPoints[0], end: endPoints[1] });
          bottomSegments.push({ start: startPoints[1], end: endPoints[0] });
        }
        var topPoints = [topSegments[0].start];
        var bottomPoints = [bottomSegments[0].start];
        for (var _i = 1; _i < topSegments.length; _i++) {
          var topIntersect = getLinesIntersectPoint(
            topSegments[_i - 1].start,
            topSegments[_i - 1].end,
            topSegments[_i].start,
            topSegments[_i].end,
          );
          var bottomIntersect = getLinesIntersectPoint(
            bottomSegments[_i - 1].start,
            bottomSegments[_i - 1].end,
            bottomSegments[_i].start,
            bottomSegments[_i].end,
          );
          topPoints.push(topIntersect);
          bottomPoints.push(bottomIntersect);
        }

        var topEndPoint = topSegments[topSegments.length - 1].end;
        var bottomEndPoint = bottomSegments[bottomSegments.length - 1].end;

        var endOverlapIntersect = getLinesIntersectPoint(
          topPoints[topPoints.length - 1],
          bottomPoints[bottomPoints.length - 1],
          topEndPoint,
          bottomEndPoint,
        );

        // correct for case where there's a hard corner and we're overlapping an area we already drew
        if (
          Point.getDistance(endOverlapIntersect, points[points.length - 1]) <
          dist
        ) {
          var topVect = topEndPoint.subtract(points[points.length - 1]);
          var overlapVect = endOverlapIntersect.subtract(
            points[points.length - 1],
          );
          // figure out if the top point is overlapping of the bottom point is overlapping by using dot-product
          var isTopOverlapping =
            topVect.x * overlapVect.x + topVect.y * overlapVect.y > 0;
          if (isTopOverlapping) {
            topEndPoint = endOverlapIntersect;
          } else {
            bottomEndPoint = endOverlapIntersect;
          }
        }

        topPoints.push(topEndPoint);
        bottomPoints.push(bottomEndPoint);
        bottomPoints.reverse();
        return topPoints.concat(bottomPoints);
      };

      module.exports = {
        extendPointOnLine: extendPointOnLine,
        filterParallelPoints: filterParallelPoints,
        getLineSegmentsPortion: getLineSegmentsPortion,
        getLinesIntersectPoint: getLinesIntersectPoint,
        getPerpendicularPointsAtDist: getPerpendicularPointsAtDist,
        linesToPolygon: linesToPolygon,
      };

      /***/
    },
    /* 11 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';

      var _require = __webpack_require__(3),
        drawPath = _require.drawPath;

      function UserStrokeRenderer() {}

      UserStrokeRenderer.prototype.render = function(ctx, props) {
        var points = props.points,
          opacity = props.opacity,
          strokeColor = props.strokeColor,
          strokeWidth = props.strokeWidth;

        ctx.save();

        ctx.globalAlpha = opacity;
        ctx.lineWidth = strokeWidth;
        ctx.strokeStyle = strokeColor;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        drawPath(ctx, points);
        ctx.stroke();

        ctx.restore();
      };

      module.exports = UserStrokeRenderer;

      /***/
    },
    /* 12 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';

      var _require = __webpack_require__(0),
        copyAndMergeDeep = _require.copyAndMergeDeep;

      function RenderState(character, options, onStateChange) {
        this._onStateChange = onStateChange;
        this._mutationChains = [];
        this.state = {
          options: {
            usePolygonMasks: options.usePolygonMasks,
            drawingFadeDuration: options.drawingFadeDuration,
            drawingWidth: options.drawingWidth,
            drawingColor: options.drawingColor,
            strokeWidth: options.strokeWidth,
          },
          character: {
            main: {
              strokeColor: options.strokeColor,
              radicalColor: options.radicalColor,
              opacity: options.showCharacter ? 1 : 0,
              strokes: {},
            },
            outline: {
              strokeColor: options.outlineColor,
              opacity: options.showOutline ? 1 : 0,
              strokes: {},
            },
            highlight: {
              strokeColor: options.highlightColor,
              opacity: 1,
              strokes: {},
            },
          },
          userStrokes: null,
        };
        for (var i = 0; i < character.strokes.length; i++) {
          this.state.character.main.strokes[i] = {
            opacity: 1,
            displayPortion: 1,
          };
          this.state.character.outline.strokes[i] = {
            opacity: 1,
            displayPortion: 1,
          };
          this.state.character.highlight.strokes[i] = {
            opacity: 0,
            displayPortion: 1,
          };
        }
      }

      RenderState.prototype.updateState = function(stateChanges) {
        var nextState = copyAndMergeDeep(this.state, stateChanges);
        this._onStateChange(nextState, this.state);
        this.state = nextState;
      };

      RenderState.prototype.run = function(mutations) {
        var _this = this;

        var options =
          arguments.length > 1 && arguments[1] !== undefined
            ? arguments[1]
            : {};

        var scopes = mutations
          .map(function(mut) {
            return mut.scope;
          })
          .filter(function(x) {
            return x;
          });
        this.cancelMutations(scopes);
        return new Promise(function(resolve) {
          var mutationChain = {
            _isActive: true,
            _index: 0,
            _resolve: resolve,
            _mutations: mutations,
            _loop: options.loop,
            _scopes: scopes,
          };
          _this._mutationChains.push(mutationChain);
          _this._run(mutationChain);
        });
      };

      RenderState.prototype._run = function(mutationChain) {
        var _this2 = this;

        if (!mutationChain._isActive) return;
        var mutations = mutationChain._mutations;
        if (mutationChain._index >= mutations.length) {
          if (mutationChain._loop) {
            mutationChain._index = 0; // eslint-disable-line no-param-reassign
          } else {
            mutationChain._isActive = false; // eslint-disable-line no-param-reassign
            this._mutationChains = this._mutationChains.filter(function(chain) {
              return chain !== mutationChain;
            });
            // The chain is done - resolve the promise with true to signal it finished successfully
            mutationChain._resolve(true);
            return;
          }
        }

        var activeMutation = mutationChain._mutations[mutationChain._index];
        activeMutation.run(this).then(function() {
          if (mutationChain._isActive) {
            mutationChain._index++; // eslint-disable-line no-param-reassign
            _this2._run(mutationChain);
          }
        });
      };

      RenderState.prototype.cancelMutations = function(scopes) {
        var _this3 = this;

        this._mutationChains.forEach(function(chain) {
          chain._scopes.forEach(function(chainScope) {
            scopes.forEach(function(scope) {
              if (chainScope.indexOf(scope) >= 0) {
                _this3._cancelMutationChain(chain);
              }
            });
          });
        });
      };

      RenderState.prototype._cancelMutationChain = function(mutationChain) {
        mutationChain._isActive = false; // eslint-disable-line no-param-reassign
        for (
          var i = mutationChain._index;
          i < mutationChain._mutations.length;
          i++
        ) {
          mutationChain._mutations[i].cancel(this);
        }
        if (mutationChain._resolve) {
          // resolve with false to indicate the chain was canceled before completion
          mutationChain._resolve(false);
        }
        this._mutationChains = this._mutationChains.filter(function(chain) {
          return chain !== mutationChain;
        });
      };

      module.exports = RenderState;

      /***/
    },
    /* 13 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';

      var _slicedToArray = (function() {
        function sliceIterator(arr, i) {
          var _arr = [];
          var _n = true;
          var _d = false;
          var _e = undefined;
          try {
            for (
              var _i = arr[Symbol.iterator](), _s;
              !(_n = (_s = _i.next()).done);
              _n = true
            ) {
              _arr.push(_s.value);
              if (i && _arr.length === i) break;
            }
          } catch (err) {
            _d = true;
            _e = err;
          } finally {
            try {
              if (!_n && _i['return']) _i['return']();
            } finally {
              if (_d) throw _e;
            }
          }
          return _arr;
        }
        return function(arr, i) {
          if (Array.isArray(arr)) {
            return arr;
          } else if (Symbol.iterator in Object(arr)) {
            return sliceIterator(arr, i);
          } else {
            throw new TypeError(
              'Invalid attempt to destructure non-iterable instance',
            );
          }
        };
      })();

      var Point = __webpack_require__(1);
      var Stroke = __webpack_require__(14);
      var Character = __webpack_require__(15);

      function CharDataParser() {}

      CharDataParser.prototype.generateCharacter = function(symbol, charJson) {
        var strokes = this.generateStrokes(charJson);
        return new Character(symbol, strokes);
      };

      CharDataParser.prototype.generateStrokes = function(charJson) {
        var isInRadical = function isInRadical(strokeNum) {
          return (
            charJson.radStrokes && charJson.radStrokes.indexOf(strokeNum) >= 0
          );
        };

        return charJson.strokes.map(function(path, index) {
          var points = charJson.medians[index].map(function(pointData) {
            var _pointData = _slicedToArray(pointData, 2),
              x = _pointData[0],
              y = _pointData[1];

            return new Point(x, y);
          });
          return new Stroke(path, points, index, isInRadical(index));
        });
      };

      module.exports = CharDataParser;

      /***/
    },
    /* 14 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';

      var Point = __webpack_require__(1);

      function Stroke(path, points, strokeNum) {
        var isInRadical =
          arguments.length > 3 && arguments[3] !== undefined
            ? arguments[3]
            : false;

        this.path = path;
        this.points = points;
        this.strokeNum = strokeNum;
        this.isInRadical = isInRadical;
      }

      Stroke.prototype.getStartingPoint = function() {
        return this.points[0];
      };

      Stroke.prototype.getEndingPoint = function() {
        return this.points[this.points.length - 1];
      };

      Stroke.prototype.getLength = function() {
        var lastPoint = this.points[0];
        var pointsSansFirst = this.points.slice(1);
        return pointsSansFirst.reduce(function(acc, point) {
          var dist = Point.getDistance(point, lastPoint);
          lastPoint = point;
          return acc + dist;
        }, 0);
      };

      Stroke.prototype.getVectors = function() {
        var lastPoint = this.points[0];
        var pointsSansFirst = this.points.slice(1);
        return pointsSansFirst.map(function(point) {
          var vector = point.subtract(lastPoint);
          lastPoint = point;
          return vector;
        });
      };

      Stroke.prototype.getDistance = function(point) {
        var distances = this.points.map(function(strokePoint) {
          return Point.getDistance(strokePoint, point);
        });
        return Math.min.apply(Math, distances);
      };

      Stroke.prototype.getAverageDistance = function(points) {
        var _this = this;

        var totalDist = points.reduce(function(acc, point) {
          return acc + _this.getDistance(point);
        }, 0);
        return totalDist / points.length;
      };

      module.exports = Stroke;

      /***/
    },
    /* 15 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';

      var Point = __webpack_require__(1);

      function Character(symbol, strokes) {
        this.symbol = symbol;
        this.strokes = strokes;
      }

      Character.prototype.getBounds = function() {
        return Point.getBounds([new Point(0, 900), new Point(1024, -124)]);
      };

      module.exports = Character;

      /***/
    },
    /* 16 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';

      var Point = __webpack_require__(1);

      function Positioner(character, options) {
        this._character = character;
        this._options = options;
        this._calculateScaleAndOffset();
      }

      Positioner.prototype.convertExternalPoint = function(point) {
        var x = (point.x - this._xOffset) / this._scale;
        var y = (this.getHeight() - this._yOffset - point.y) / this._scale;
        return new Point(x, y);
      };

      Positioner.prototype.getXOffset = function() {
        return this._xOffset;
      };
      Positioner.prototype.getYOffset = function() {
        return this._yOffset;
      };
      Positioner.prototype.getScale = function() {
        return this._scale;
      };
      Positioner.prototype.getHeight = function() {
        return this._options.height;
      };
      Positioner.prototype.getWidth = function() {
        return this._options.width;
      };

      Positioner.prototype._calculateScaleAndOffset = function() {
        var bounds = this._character.getBounds();
        var preScaledWidth = bounds[1].x - bounds[0].x;
        var preScaledHeight = bounds[1].y - bounds[0].y;
        var effectiveWidth = this._options.width - 2 * this._options.padding;
        var effectiveHeight = this._options.height - 2 * this._options.padding;
        var scaleX = effectiveWidth / preScaledWidth;
        var scaleY = effectiveHeight / preScaledHeight;

        this._scale = Math.min(scaleX, scaleY);

        var xCenteringBuffer =
          this._options.padding +
          (effectiveWidth - this._scale * preScaledWidth) / 2;
        var yCenteringBuffer =
          this._options.padding +
          (effectiveHeight - this._scale * preScaledHeight) / 2;
        this._xOffset = -1 * bounds[0].x * this._scale + xCenteringBuffer;
        this._yOffset = -1 * bounds[0].y * this._scale + yCenteringBuffer;
      };

      module.exports = Positioner;

      /***/
    },
    /* 17 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';

      var StrokeMatcher = __webpack_require__(18);
      var UserStroke = __webpack_require__(19);

      var _require = __webpack_require__(0),
        callIfExists = _require.callIfExists,
        counter = _require.counter;

      var quizActions = __webpack_require__(20);
      var characterActions = __webpack_require__(4);

      function Quiz(character, renderState, quizOptions) {
        this._character = character;
        this._renderState = renderState;
        this._isActive = false;
        this._strokeMatcher = new StrokeMatcher();
      }

      Quiz.prototype.startQuiz = function(options) {
        this._isActive = true;
        this._options = options;
        this._currentStrokeIndex = 0;
        this._numRecentMistakes = 0;
        this._totalMistakes = 0;
        this._drawnStrokes = [];
        this._renderState.run(
          quizActions.startQuiz(this._character, options.strokeFadeDuration),
        );
      };

      Quiz.prototype.startUserStroke = function(point) {
        if (!this._isActive) return null;
        if (this._userStroke) return this.endUserStroke();
        var strokeId = counter();
        this._userStroke = new UserStroke(strokeId, point);
        this._renderState.run(quizActions.startUserStroke(strokeId, point));
      };

      Quiz.prototype.continueUserStroke = function(point) {
        if (!this._userStroke) return;
        this._userStroke.appendPoint(point);
        var nextPoints = this._userStroke.points.slice(0);
        this._renderState.run(
          quizActions.updateUserStroke(this._userStroke.id, nextPoints),
        );
      };

      Quiz.prototype.endUserStroke = function() {
        if (!this._userStroke) return;

        this._renderState.run(
          quizActions.removeUserStroke(
            this._userStroke.id,
            this._options.drawingFadeDuration,
          ),
        );

        var currentStroke = this._getCurrentStroke();
        var isMatch = this._strokeMatcher.strokeMatches(
          this._userStroke,
          currentStroke,
        );
        this._userStroke = null;

        if (isMatch) {
          this._handleSuccess(currentStroke);
        } else {
          this._handleFailure();
          if (this._numRecentMistakes >= this._options.showHintAfterMisses) {
            this._renderState.run(
              characterActions.highlightStroke(
                'highlight',
                currentStroke,
                this._options.strokeHighlightSpeed,
              ),
              { force: true },
            );
          }
        }
      };

      Quiz.prototype.cancel = function() {
        this._isActive = false;
        if (this._userStroke) {
          this._renderState.run(
            quizActions.removeUserStroke(
              this._userStroke.id,
              this._options.drawingFadeDuration,
            ),
          );
        }
      };

      Quiz.prototype._handleSuccess = function(stroke) {
        callIfExists(this._options.onCorrectStroke, {
          character: this._character.symbol,
          strokeNum: this._currentStrokeIndex,
          mistakesOnStroke: this._numRecentMistakes,
          totalMistakes: this._totalMistakes,
          strokesRemaining:
            this._character.strokes.length - this._currentStrokeIndex - 1,
        });
        var animation = characterActions.showStroke(
          'main',
          this._currentStrokeIndex,
          this._options.strokeFadeDuration,
        );
        this._currentStrokeIndex += 1;
        this._numRecentMistakes = 0;

        if (this._currentStrokeIndex === this._character.strokes.length) {
          this._isActive = false;
          callIfExists(this._options.onComplete, {
            character: this._character.symbol,
            totalMistakes: this._totalMistakes,
          });
          if (this._options.highlightOnComplete) {
            animation = animation
              .concat(
                characterActions.hideCharacter('highlight', this._character),
              )
              .concat(
                characterActions.showCharacter(
                  'highlight',
                  this._character,
                  this._options.strokeHighlightDuration,
                ),
              )
              .concat(
                characterActions.hideCharacter(
                  'highlight',
                  this._character,
                  this._options.strokeHighlightDuration,
                ),
              );
          }
        }
        this._renderState.run(animation);
      };

      Quiz.prototype._handleFailure = function() {
        this._numRecentMistakes += 1;
        this._totalMistakes += 1;
        callIfExists(this._options.onMistake, {
          character: this._character.symbol,
          strokeNum: this._currentStrokeIndex,
          mistakesOnStroke: this._numRecentMistakes,
          totalMistakes: this._totalMistakes,
          strokesRemaining:
            this._character.strokes.length - this._currentStrokeIndex,
        });
      };

      Quiz.prototype._getCurrentStroke = function() {
        return this._character.strokes[this._currentStrokeIndex];
      };

      module.exports = Quiz;

      /***/
    },
    /* 18 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';

      var Point = __webpack_require__(1);

      var _require = __webpack_require__(0),
        average = _require.average;

      var AVG_DIST_THRESHOLD = 300; // bigger = more lenient
      var COSINE_SIMILARITY_THRESHOLD = 0; // -1 to 1, smaller = more lenient
      var START_AND_END_DIST_THRESHOLD = 250; // bigger = more lenient

      function StrokeMatcher() {}

      StrokeMatcher.prototype.strokeMatches = function(userStroke, stroke) {
        var points = this._stripDuplicates(userStroke.points);
        if (points.length < 2) return null;

        var avgDist = stroke.getAverageDistance(points);
        var withinDistThresh = avgDist < AVG_DIST_THRESHOLD;
        var startAndEndMatch = this._startAndEndMatches(points, stroke);
        var directionMatches = this._directionMatches(points, stroke);
        return withinDistThresh && startAndEndMatch && directionMatches;
      };

      StrokeMatcher.prototype._startAndEndMatches = function(
        points,
        closestStroke,
      ) {
        var startingDist = Point.getDistance(
          closestStroke.getStartingPoint(),
          points[0],
        );
        var endingDist = Point.getDistance(
          closestStroke.getEndingPoint(),
          points[points.length - 1],
        );
        return (
          startingDist < START_AND_END_DIST_THRESHOLD &&
          endingDist < START_AND_END_DIST_THRESHOLD
        );
      };

      StrokeMatcher.prototype._directionMatches = function(points, stroke) {
        var edgeVectors = this._getEdgeVectors(points);
        var strokeVectors = stroke.getVectors();
        var similarities = edgeVectors.map(function(edgeVector) {
          var strokeSimilarities = strokeVectors.map(function(strokeVector) {
            return Point.cosineSimilarity(strokeVector, edgeVector);
          });
          return Math.max.apply(Math, strokeSimilarities);
        });
        var avgSimilarity = average(similarities);
        return avgSimilarity > COSINE_SIMILARITY_THRESHOLD;
      };

      StrokeMatcher.prototype._stripDuplicates = function(points) {
        if (points.length < 2) return points;
        var dedupedPoints = [points[0]];
        points.slice(1).forEach(function(point) {
          if (!point.equals(dedupedPoints[dedupedPoints.length - 1])) {
            dedupedPoints.push(point);
          }
        });
        return dedupedPoints;
      };

      StrokeMatcher.prototype._getLength = function(points) {
        var length = 0;
        var lastPoint = points[0];
        points.forEach(function(point) {
          length += Point.getDistance(point, lastPoint);
          lastPoint = point;
        });
        return length;
      };

      // returns a list of the direction of all segments in the line connecting the points
      StrokeMatcher.prototype._getEdgeVectors = function(points) {
        var vectors = [];
        var lastPoint = points[0];
        points.slice(1).forEach(function(point) {
          vectors.push(point.subtract(lastPoint));
          lastPoint = point;
        });
        return vectors;
      };

      module.exports = StrokeMatcher;

      /***/
    },
    /* 19 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';

      function UserStroke(id, startingPoint) {
        this.id = id;
        this.points = [startingPoint];
      }

      UserStroke.prototype.appendPoint = function(point) {
        this.points.push(point);
      };

      module.exports = UserStroke;

      /***/
    },
    /* 20 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';

      var Mutation = __webpack_require__(5);
      var characterActions = __webpack_require__(4);

      var _require = __webpack_require__(0),
        objRepeat = _require.objRepeat;

      var startQuiz = function startQuiz(character, fadeDuration) {
        return characterActions
          .hideCharacter('main', character, fadeDuration)
          .concat([
            new Mutation('character.main', {
              opacity: 1,
              strokes: objRepeat({ opacity: 0 }, character.strokes.length),
            }),
          ]);
      };

      var startUserStroke = function startUserStroke(id, point) {
        return [
          new Mutation('quiz.activeUserStrokeId', id),
          new Mutation('userStrokes.' + id, {
            points: [point],
            opacity: 1,
          }),
        ];
      };

      var updateUserStroke = function updateUserStroke(userStrokeId, points) {
        return [
          new Mutation('userStrokes.' + userStrokeId + '.points', points),
        ];
      };

      var removeUserStroke = function removeUserStroke(userStrokeId, duration) {
        return [
          new Mutation('userStrokes.' + userStrokeId + '.opacity', 0, {
            duration: duration,
          }),
          new Mutation('userStrokes.' + userStrokeId, null, { force: true }),
        ];
      };

      module.exports = {
        startQuiz: startQuiz,
        startUserStroke: startUserStroke,
        updateUserStroke: updateUserStroke,
        removeUserStroke: removeUserStroke,
      };

      /***/
    },
    /* 21 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';
      /* WEBPACK VAR INJECTION */ (function(global) {
        // corresponds to the integer in the gh-pages branch under the cdn folder
        // make sure to check out a new version of the master branch in gh-pages when changing the data format
        // otherwise this may break any existing hanzi-writer deploys in the wild
        var VERSION = '1';
        var getCharDataUrl = function getCharDataUrl(char) {
          return (
            'https://cdn.jsdelivr.net/npm/hanzi-writer-data@' +
            VERSION +
            '/' +
            char +
            '.json'
          );
        };

        module.exports = function(char, onLoad, onError) {
          // load char data from hanziwriter.org cdn (currently hosted on github pages)
          var xhr = new global.XMLHttpRequest();
          if (xhr.overrideMimeType) {
            // IE 9 and 10 don't seem to support this...
            xhr.overrideMimeType('application/json');
          }
          xhr.open('GET', getCharDataUrl(char), true);
          xhr.onerror = function(event) {
            onError(xhr, event);
          };
          xhr.onreadystatechange = function() {
            // TODO: error handling
            if (xhr.readyState !== 4) return;

            if (xhr.status === 200) {
              onLoad(JSON.parse(xhr.responseText));
            } else if (onError) {
              onError(xhr);
            }
          };
          xhr.send(null);
        };
        /* WEBPACK VAR INJECTION */
      }.call(exports, __webpack_require__(2)));

      /***/
    },
    /* 22 */
    /***/ function(module, exports, __webpack_require__) {
      'use strict';

      var _require = __webpack_require__(0),
        callIfExists = _require.callIfExists;

      function LoadingManager(options) {
        this._loadCounter = 0;
        this._options = options;
        this._isLoading = false;
        this._loadingPromise = null;

        // use this to attribute to determine if there was a problem with loading
        this.loadingFailed = false;
      }

      LoadingManager.prototype._debouncedLoad = function(char, count) {
        var _this = this;

        // these wrappers ignore all responses except the most recent.
        var wrappedResolve = function wrappedResolve(data) {
          if (count === _this._loadCounter) _this._resolve(data);
        };
        var wrappedReject = function wrappedReject(reason) {
          if (count === _this._loadCounter) _this._reject(reason);
        };

        var returnedData = this._options.charDataLoader(
          char,
          wrappedResolve,
          wrappedReject,
        );
        if (returnedData) wrappedResolve(returnedData);
      };

      LoadingManager.prototype._setupLoadingPromise = function() {
        var _this2 = this;

        this._loadingPromise = new Promise(function(resolve, reject) {
          _this2._resolve = resolve;
          _this2._reject = reject;
        }).then(
          function(data) {
            _this2._isLoading = false;
            callIfExists(_this2._options.onLoadCharDataSuccess, data);
            return data;
          },
          function(reason) {
            _this2._isLoading = false;
            _this2.loadingFailed = true;
            callIfExists(_this2._options.onLoadCharDataError, reason);
            // If error callback wasn't provided, throw an error so the developer will be aware something went wrong
            if (!_this2._options.onLoadCharDataError) {
              if (reason instanceof Error) throw reason;
              var err = new Error(
                'Failed to load char data for ' + _this2._loadingChar,
              );
              err.reason = reason;
              throw err;
            }
          },
        );
      };

      LoadingManager.prototype.loadCharData = function(char) {
        this._loadingChar = char;
        if (!this._isLoading) {
          this._setupLoadingPromise();
        }
        this.loadingFailed = false;
        this._isLoading = true;
        this._loadCounter++;
        this._debouncedLoad(char, this._loadCounter);
        return this._loadingPromise;
      };

      module.exports = LoadingManager;

      /***/
    },
    /******/
  ],
);
