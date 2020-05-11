'use strict';

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var TimerStatus = function TimerStatus() {
  _classCallCheck(this, TimerStatus);
};

_defineProperty(TimerStatus, "INIT", Symbol());

_defineProperty(TimerStatus, "RUNNING", Symbol());

_defineProperty(TimerStatus, "PAUSE", Symbol());

_defineProperty(TimerStatus, "TIMESUP", Symbol());

var Timer = /*#__PURE__*/function () {
  function Timer() {
    _classCallCheck(this, Timer);

    this._previousTicks = 0;
    this._startTick = null;
  }

  _createClass(Timer, [{
    key: "stop",
    value: function stop() {
      if (this.isRunning) {
        this._previousTicks += new Date().getTime() - this._startTick;
        this._startTick = null;
      }
    }
  }, {
    key: "start",
    value: function start() {
      throw new Error("NotImplementedError");
    }
    /**
     * Set the time value of this timer
     * @param {number} a Hour or tick
     * @param {number} b Minute or undefined
     * @param {number} c Second or undefined
     */

  }, {
    key: "set",
    value: function set(a, b, c) {
      throw new Error("NotImplementedError");
    }
  }, {
    key: "reset",
    value: function reset() {
      this._startTick = null;
      this._previousTicks = 0;
      var _vi$timerEditableData = vi.timerEditableData,
          hour = _vi$timerEditableData.hour,
          minute = _vi$timerEditableData.minute,
          second = _vi$timerEditableData.second;
      this.set(hour, minute, second);
    }
  }, {
    key: "displayTicks",
    get: function get() {
      throw new Error("NotImplementedError");
    }
  }, {
    key: "isRunning",
    get: function get() {
      return this.status == TimerStatus.RUNNING;
    }
  }, {
    key: "status",
    get: function get() {
      throw new Error("NotImplementedError");
    }
  }]);

  return Timer;
}();

var StopwatchTimer = /*#__PURE__*/function (_Timer) {
  _inherits(StopwatchTimer, _Timer);

  var _super = _createSuper(StopwatchTimer);

  function StopwatchTimer() {
    var _this;

    _classCallCheck(this, StopwatchTimer);

    _this = _super.call(this);
    _this._initTicks = 0;
    return _this;
  }

  _createClass(StopwatchTimer, [{
    key: "start",
    value: function start() {
      // override
      if (!this.isRunning) this._startTick = new Date().getTime();
    }
  }, {
    key: "set",
    value: function set(a, b, c) {
      if (b != null && c != null) a = a * 3600000 + b * 60000 + c * 1000;

      if (this.status == TimerStatus.PAUSE) {
        this._initTicks = a + this.displayTicks % 1000 - 1; // keep ms

        this._previousTicks = 1; // keep pause mode
      } else {
        this._initTicks = a;
      }
    }
  }, {
    key: "displayTicks",
    get: function get() {
      return this.passedTicks;
    }
  }, {
    key: "status",
    get: function get() {
      // override
      if (this._startTick == null && this._previousTicks == 0) return TimerStatus.INIT;else if (this._startTick == null && this._previousTicks != 0) return TimerStatus.PAUSE;else return TimerStatus.RUNNING;
    }
  }, {
    key: "passedTicks",
    get: function get() {
      return Math.max(0, (this._startTick ? new Date().getTime() - this._startTick : 0) + this._initTicks + this._previousTicks);
    }
  }]);

  return StopwatchTimer;
}(Timer);

var CountdownTimer = /*#__PURE__*/function (_Timer2) {
  _inherits(CountdownTimer, _Timer2);

  var _super2 = _createSuper(CountdownTimer);

  function CountdownTimer() {
    var _this2;

    _classCallCheck(this, CountdownTimer);

    _this2 = _super2.call(this);
    _this2._totalTicks = 0;
    return _this2;
  }

  _createClass(CountdownTimer, [{
    key: "start",
    value: function start() {
      // override
      if (!this.isRunning && !this.isTimeup) this._startTick = new Date().getTime();
    }
  }, {
    key: "set",
    value: function set(a, b, c) {
      if (b != null && c != null) a = a * 3600000 + b * 60000 + c * 1000;

      if (this.status == TimerStatus.PAUSE) {
        this._totalTicks = a + this.displayTicks % 1000 + 1; // keep ms

        this._previousTicks = 1; // keep pause mode
      } else {
        this._totalTicks = a;
      }
    }
  }, {
    key: "displayTicks",
    get: function get() {
      return this.remainingTicks;
    }
  }, {
    key: "isTimeup",
    get: function get() {
      return this.status == TimerStatus.TIMESUP;
    }
  }, {
    key: "status",
    get: function get() {
      // override
      if (this._startTick == null && this._previousTicks == 0) return TimerStatus.INIT;else if (this._startTick != null && this.remainingTicks != 0) return TimerStatus.RUNNING;else if (this._startTick == null && this._previousTicks != 0) return TimerStatus.PAUSE;else if (this.remainingTicks == 0) return TimerStatus.TIMESUP;
    }
  }, {
    key: "totalTicks",
    get: function get() {
      return this._totalTicks;
    }
  }, {
    key: "remainingTicks",
    get: function get() {
      return Math.max(0, (this._startTick ? this._startTick - new Date().getTime() : 0) + this._totalTicks - this._previousTicks);
    }
  }]);

  return CountdownTimer;
}(Timer);

function getAllEditableTimeValueField() {
  return _toConsumableArray(document.querySelectorAll('#timer-value > *[contenteditable]'));
}

var vi = new Vue({
  el: '#thebody',
  mounted: function mounted() {
    var _this3 = this;

    getAllEditableTimeValueField().forEach(function (x) {
      x.addEventListener('focus', _this3.focusTimeValueFieldEvent, false);
      x.addEventListener('blur', _this3.blurTimeValueFieldEvent, false);
      x.addEventListener('beforeinput', _this3.b4changedTimeValueFieldEvent, false);
      x.addEventListener('input', _this3.changedTimeValueFieldEvent, false);
    });
  },
  data: {
    lang: lang,
    languagesList: languagesList,
    t: new CountdownTimer(),
    timerEditableData: {
      hour: 0,
      minute: 0,
      second: 0
    },
    timerEditingFlag: {
      hour: false,
      minute: false,
      second: false
    },
    themesList: ['dark', 'light'],
    theme: 'dark'
  },
  watch: {
    theme: {
      handler: function handler() {
        document.querySelector('body').className = this.theme;
      },
      immediate: true
    }
  },
  methods: {
    BodyKeyDownEvent: function BodyKeyDownEvent(e) {
      if (e.key === 'Tab' || e.key === 'Enter') {
        var target_id = e.target.id;

        if (target_id === 'hour' || target_id === 'minute' || target_id === 'second') {
          e.preventDefault();
          var now = e.target;
          var allFields = getAllEditableTimeValueField();
          var next = allFields[(allFields.indexOf(now) + 1) % allFields.length];
          now.blur();
          next.focus();
        }
      }
    },
    clickBtn0Event: function clickBtn0Event() {
      if (this.t.status == TimerStatus.INIT) {
        var oldClockTicks = this.t.displayTicks;
        this.t = this.t instanceof CountdownTimer ? new StopwatchTimer() : new CountdownTimer();
        this.t.set(oldClockTicks);
      }
    },
    clickBtn1Event: function clickBtn1Event() {
      if (this.t.status == TimerStatus.INIT) {
        if (this.t instanceof CountdownTimer && this.t.totalTicks == 0) return;else this.t.start();
      } else if (this.t.status == TimerStatus.RUNNING) this.t.stop();else if (this.t.status == TimerStatus.PAUSE) this.t.start();
    },
    clickBtn2Event: function clickBtn2Event() {
      if (this.t instanceof StopwatchTimer) {
        // if stopwatch, to 0
        this.timerEditableData = {
          hour: 0,
          minute: 0,
          second: 0
        };
      }

      this.t.reset();
    },
    updateEditableDataAndHtml: function updateEditableDataAndHtml(target, value) {
      if (target.id === 'hour') {
        value = Math.max(0, Math.min(value, 99));
      } else if (target.id === 'minute') {
        value = Math.max(0, Math.min(value, 59));
      } else if (target.id === 'second') {
        value = Math.max(0, Math.min(value, 59));
      }

      this.timerEditableData[target.id] = value;
      target.innerText = value;
      var _this$timerEditableDa = this.timerEditableData,
          hour = _this$timerEditableDa.hour,
          minute = _this$timerEditableDa.minute,
          second = _this$timerEditableDa.second;
      this.t.set(hour, minute, second);
    },
    focusTimeValueFieldEvent: function focusTimeValueFieldEvent(e) {
      var target = e.target;
      this.timerEditingFlag[target.id] = true;
      target.beforeFocus = target.innerText;
    },
    blurTimeValueFieldEvent: function blurTimeValueFieldEvent(e) {
      var target = e.target;
      var value_str = target.innerText;
      var value = Math.trunc(value_str);
      this.timerEditingFlag[target.id] = false; // important

      if (value_str.length == 0 || value_str.length > 2 || isNaN(value) || value_str.indexOf('.') !== -1) {
        value = Math.trunc(target.beforeFocus);
      }

      this.updateEditableDataAndHtml(target, value);
    },
    b4changedTimeValueFieldEvent: function b4changedTimeValueFieldEvent(e) {
      e.target.beforeInput = e.target.innerText;
    },
    changedTimeValueFieldEvent: function changedTimeValueFieldEvent(e) {
      var sel = window.getSelection();
      var startOffset = sel.getRangeAt(0).startOffset; // the orignal

      var target = e.target;
      var value_str = target.innerText;

      if (value_str.length == 0) {
        value_str = target.innerText = '0';
      } else if (value_str.length > 2) {
        value_str = target.innerText = value_str.slice(0, 2);
      }

      var value = Math.trunc(value_str);

      if (isNaN(value) || value_str.indexOf('.') !== -1) {
        value = Math.trunc(target.beforeInput);
      } // update the data


      this.updateEditableDataAndHtml(target, value); // set target.innerText will reset the caret position to zero
      // set the caret position to undo the effect

      var newRange = document.createRange();
      newRange.setStart(target.childNodes[0], Math.min(target.innerText.length, startOffset));
      newRange.collapse(true);
      sel.removeAllRanges();
      sel.addRange(newRange);
    }
  },
  computed: {
    displayTicks: function displayTicks() {
      return t.displayTicks;
    },

    /**
     * when the flag == true, the user start typing. we should clear the content
     */
    timeH: function timeH() {
      if (this.timerEditingFlag.hour) return '';
      var time = Math.trunc(this.t.displayTicks / 3600000);
      return time > 9 ? time + '' : '0' + time;
    },
    timeM: function timeM() {
      if (this.timerEditingFlag.minute) return '';
      var time = Math.trunc(this.t.displayTicks % 3600000 / 60000);
      return time > 9 ? time + '' : '0' + time;
    },
    timeS: function timeS() {
      if (this.timerEditingFlag.second) return '';
      var time = Math.trunc(this.t.displayTicks % 60000 / 1000);
      return time > 9 ? time + '' : '0' + time;
    },
    timeMS: function timeMS() {
      if (this.t.status == TimerStatus.INIT) return '000';
      var time = Math.trunc(this.t.displayTicks % 1000);
      return time;
    },
    isBtn0Disabled: function isBtn0Disabled() {
      return this.t.status != TimerStatus.INIT;
    },
    isBtn1Disabled: function isBtn1Disabled() {
      return this.t instanceof CountdownTimer ? this.t.status == TimerStatus.TIMESUP || this.t.displayTicks == 0 : false;
    },
    getBtn1Warning: function getBtn1Warning() {
      return this.t.status == TimerStatus.TIMESUP ? lang.times_up_blocked_warning : lang.time_zero_warning;
    },
    getBtn0Message: function getBtn0Message() {
      return this.t instanceof CountdownTimer ? lang.countdown : lang.stopwatch;
    },
    getBtn1Message: function getBtn1Message() {
      return this.t.status == TimerStatus.RUNNING ? lang.pause : lang.start;
    },
    isEditable: function isEditable() {
      return this.t.status == TimerStatus.INIT || this.t.status == TimerStatus.PAUSE;
    }
  }
});
setInterval(function () {
  // HACK, manually update
  vi.t.__ob__.dep.notify();
}, 1);