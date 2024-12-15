"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var toast = {
  timeoutID: null,
  styles: {
    position: 'fixed',
    left: '0px',
    top: '0px',
    padding: '15px',
    color: '#fff',
    'z-index': '1500',
    'text-align': 'center',
    width: '100%'
  },
  success: function success(text) {
    this.show(text, 'success');
  },
  error: function error(text) {
    this.show(text, 'error');
  },
  warning: function warning(text) {
    this.show(text, 'warning');
  },
  info: function info(text) {
    this.show(text, 'info');
  },
  show: function show(text) {
    var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    var myToast = document.getElementById('my-toast');

    if (myToast) {
      clearTimeout(this.timeoutID);
      myToast.remove();
    }

    var style = '';
    Object.entries(this.styles).forEach(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          key = _ref2[0],
          value = _ref2[1];

      style += "".concat(key, ": ").concat(value, ";");
    });

    switch (type) {
      case 'success':
        style += 'background-color: #198754;';
        break;

      case 'error':
        style += 'background-color: #dc3545;';
        break;

      case 'warning':
        style += 'background-color: #fd7e14;';
        break;

      case 'info':
        style += 'background-color: #0dcaf0;';
    }

    var html = "<div id=\"my-toast\" class=\"my-toast ".concat(type, "\" style=\"").concat(style, "\">\n            <p class=\"mb-0\">").concat(text, "</p>\n        </div>");
    document.body.insertAdjacentHTML('afterbegin', html);
    this.hide(3000);
  },
  hide: function hide(timeout) {
    this.timeoutID = setTimeout(function () {
      var myToast = document.getElementById('my-toast');
      myToast && myToast.remove();
    }, timeout);
  }
};