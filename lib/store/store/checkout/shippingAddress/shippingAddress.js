import _regeneratorRuntime from "@babel/runtime/regenerator";
import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import ZonesGql from "./list.graphql";
export var state = function () {
  return {
    zones: {
      content: []
    }
  };
};
export var getters = {
  zones: function zones(state) {
    return state.zones;
  }
};
export var mutations = {
  setZones: function setZones(state, payload) {
    state.zones = payload;
  }
};
export var actions = {
  zones: function zones(_ref, zoneData) {
    return _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
      var commit, dispatch, rootGetters;
      return _regeneratorRuntime.wrap(function (_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              commit = _ref.commit, dispatch = _ref.dispatch, rootGetters = _ref.rootGetters;
              _context.next = 3;
              return dispatch("apollo/query", {
                query: ZonesGql,
                variables: zoneData
              }, {
                root: true
              });

            case 3:
              if (!rootGetters["vuefront/error"]) {
                commit("setZones", rootGetters["apollo/get"].zonesList);
              }

            case 4:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }))();
  }
};