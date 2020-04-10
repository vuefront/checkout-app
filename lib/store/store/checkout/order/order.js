import _regeneratorRuntime from "@babel/runtime/regenerator";
import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import CreateGql from './create.graphql';
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
  }
};