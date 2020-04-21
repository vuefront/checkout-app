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
    var commit = _ref.commit,
        dispatch = _ref.dispatch,
        rootGetters = _ref.rootGetters;
    return _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
      return _regeneratorRuntime.wrap(function (_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return dispatch('apollo/mutate', {
                mutation: CreateGql,
                variables: payload
              }, {
                root: true
              });

            case 2:
              if (!rootGetters['vuefront/error']) {
                commit('setOrder', rootGetters['apollo/get'].createOrder.order);
                commit('setUrl', rootGetters['apollo/get'].createOrder.url);
              }

            case 3:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }))();
  },
  update: function update(_ref2, payload) {
    var _this = this;

    var commit = _ref2.commit;
    return _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee2() {
      var _ref3, data;

      return _regeneratorRuntime.wrap(function (_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              _context2.next = 3;
              return _this.$vfapollo.mutate({
                mutation: UpdateGql,
                variables: payload
              });

            case 3:
              _ref3 = _context2.sent;
              data = _ref3.data;
              return _context2.abrupt("return", data);

            case 8:
              _context2.prev = 8;
              _context2.t0 = _context2["catch"](0);
              commit('vuefront/setResponseError', _context2.t0, {
                root: true
              });

            case 11:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, null, [[0, 8]]);
    }))();
  },
  confirm: function confirm(_ref4) {
    var _this2 = this;

    var commit = _ref4.commit;
    return _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee3() {
      var _ref5, data;

      return _regeneratorRuntime.wrap(function (_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.prev = 0;
              _context3.next = 3;
              return _this2.$vfapollo.mutate({
                mutation: ConfirmGql,
                variables: {}
              });

            case 3:
              _ref5 = _context3.sent;
              data = _ref5.data;
              commit('setOrder', data.confirmOrder.order);
              commit('setUrl', data.confirmOrder.url);
              _context3.next = 12;
              break;

            case 9:
              _context3.prev = 9;
              _context3.t0 = _context3["catch"](0);
              commit('vuefront/setResponseError', _context3.t0, {
                root: true
              });

            case 12:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, null, [[0, 9]]);
    }))();
  }
};