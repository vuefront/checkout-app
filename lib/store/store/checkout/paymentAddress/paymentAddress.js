import _regeneratorRuntime from "@babel/runtime/regenerator";
import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import ZonesGql from './list.graphql';
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
    var _this = this;

    var commit = _ref.commit;
    return _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
      var _ref2, data;

      return _regeneratorRuntime.wrap(function (_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _context.next = 3;
              return _this.$vfapollo.query({
                query: ZonesGql,
                variables: zoneData
              });

            case 3:
              _ref2 = _context.sent;
              data = _ref2.data;
              commit('setZones', data.zonesList);
              _context.next = 12;
              break;

            case 8:
              _context.prev = 8;
              _context.t0 = _context["catch"](0);
              console.log(_context.t0);
              commit('vuefront/setResponseError', _context.t0, {
                root: true
              });

            case 12:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[0, 8]]);
    }))();
  }
};