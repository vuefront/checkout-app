import _regeneratorRuntime from "@babel/runtime/regenerator";
import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import CreateGql from './create.graphql';
import UpdateGql from './update.graphql';
import ConfirmGql from './confirm.graphql';
export var state = function () {
  return {
    order: {},
    url: ''
  };
};
export var getters = {
  order: function order(state) {
    return state.order;
  },
  url: function url(state) {
    return state.url;
  }
};
export var mutations = {
  setOrder: function setOrder(state, payload) {
    state.order = payload;
  },
  setUrl: function setUrl(state, payload) {
    state.url = payload;
  }
};
export var actions = {
  create: function create(_ref, payload) {
    return _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
      var commit, dispatch, rootGetters;
      return _regeneratorRuntime.wrap(function (_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              commit = _ref.commit, dispatch = _ref.dispatch, rootGetters = _ref.rootGetters;
              _context.next = 3;
              return dispatch('apollo/mutate', {
                mutation: CreateGql,
                variables: payload
              }, {
                root: true
              });

            case 3:
              if (!rootGetters['vuefront/error']) {
                commit('setOrder', rootGetters['apollo/get'].createOrder.order);
                commit('setUrl', rootGetters['apollo/get'].createOrder.url);
              }

            case 4:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }))();
  },
  update: function update(_ref2, payload) {
    var _this = this;

    return _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2() {
      var commit, _yield$_this$$vfapoll, data;

      return _regeneratorRuntime.wrap(function (_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              commit = _ref2.commit;
              _context2.prev = 1;
              _context2.next = 4;
              return _this.$vfapollo.mutate({
                mutation: UpdateGql,
                variables: payload
              });

            case 4:
              _yield$_this$$vfapoll = _context2.sent;
              data = _yield$_this$$vfapoll.data;
              return _context2.abrupt("return", data);

            case 9:
              _context2.prev = 9;
              _context2.t0 = _context2["catch"](1);
              commit('vuefront/setResponseError', _context2.t0, {
                root: true
              });

            case 12:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, null, [[1, 9]]);
    }))();
  },
  confirm: function confirm(_ref3) {
    var _this2 = this;

    return _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3() {
      var commit, _yield$_this2$$vfapol, data;

      return _regeneratorRuntime.wrap(function (_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              commit = _ref3.commit;
              _context3.prev = 1;
              _context3.next = 4;
              return _this2.$vfapollo.mutate({
                mutation: ConfirmGql,
                variables: {}
              });

            case 4:
              _yield$_this2$$vfapol = _context3.sent;
              data = _yield$_this2$$vfapol.data;
              commit('setOrder', data.confirmOrder.order);
              commit('setUrl', data.confirmOrder.url);
              _context3.next = 13;
              break;

            case 10:
              _context3.prev = 10;
              _context3.t0 = _context3["catch"](1);
              commit('vuefront/setResponseError', _context3.t0, {
                root: true
              });

            case 13:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, null, [[1, 10]]);
    }))();
  }
};