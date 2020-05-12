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
    value: function set(a, b, c, d) {
      throw new Error("NotImplementedError");
    }
  }, {
    key: "reset",
    value: function reset() {
      this._startTick = null;
      this._previousTicks = 0; // CountdownTimer -> _totalTicks; StopwatchTimer -> 0

      this.set(this._totalTicks || 0);
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
    value: function set(a, b, c, d) {
      if (b != null && c != null && d != null) a = a * 3600000 + b * 60000 + c * 1000 + d;

      if (this.status == TimerStatus.PAUSE) {
        this._initTicks = a - 1; // keep ms

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
    value: function set(a, b, c, d) {
      if (b != null && c != null && d != null) a = a * 3600000 + b * 60000 + c * 1000 + d;

      if (this.status == TimerStatus.PAUSE) {
        this._totalTicks = a + 1; // keep ms

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

var lang;
var languagesList = {
  "en-US": "English",
  "zh-HK": "繁體中文"
};
var rawTheme = 'dark';
var rawTimer = new CountdownTimer();
var vi;

function loadLanguage(code) {
  var fileref = document.createElement('script');
  fileref.setAttribute('src', './lang/' + code + '.js');
  document.getElementsByTagName("head")[0].appendChild(fileref);
}

function useLanguage(newLang) {
  lang = lang == undefined ? newLang : Object.assign(lang, newLang);
  setCookie({
    lang: lang.name
  });
}

function setCookie(input) {
  var expiryDate = new Date();
  expiryDate.setFullYear(expiryDate.getFullYear() + 1);
  Object.keys(input).forEach(function (key) {
    return document.cookie = "".concat(key, "=").concat(input[key], "; expires=").concat(expiryDate.toGMTString(), ";");
  });
}

function getCookie() {
  var rtn = {};
  document.cookie.split(';').forEach(function (token) {
    var splited = token.split('=');
    if (splited.length > 1) rtn[splited[0].trim()] = splited[1].trim();
  });
  return rtn;
}

function getAllEditableTimeValueField() {
  return [].concat(_toConsumableArray(document.querySelectorAll('#timer-value > *[contenteditable]')), [document.querySelector('#msec')]);
}

function getTimerData() {
  var fields = getAllEditableTimeValueField();
  return {
    hour: fields[0].innerText - 0,
    minute: fields[1].innerText - 0,
    second: fields[2].innerText - 0,
    msec: fields[3].innerText - 0
  };
}

(function () {
  var cookie = getCookie(); // language

  var code = cookie.lang;

  if (code == undefined) {
    var language = window.navigator.userLanguage || window.navigator.language;

    var check = function check(r) {
      return r.test(language);
    };

    switch (true) {
      case check(/yue.*/):
      case check(/zh.*/):
        code = "zh-HK";
        break;
    }
  }

  if (code != undefined) loadLanguage(code); // no need to loadLanguage, english auto load
  // theme

  rawTheme = cookie.theme || rawTheme; // timer

  if (cookie.timer_mode) {
    if (cookie.timer_mode == 'countdown') {
      rawTimer = new CountdownTimer();
      rawTimer._totalTicks = Math.trunc(cookie.timer_total_ticks) || 0;
    } else {
      rawTimer = new StopwatchTimer();
      rawTimer._initTicks = Math.trunc(cookie.timer_init_ticks) || 0;
    }

    rawTimer._startTick = Math.trunc(cookie.timer_start_tick) || null;
    rawTimer._previousTicks = Math.trunc(cookie.timer_previous_ticks) || 0;
  }
})();