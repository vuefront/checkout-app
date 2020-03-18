import _regeneratorRuntime from "@babel/runtime/regenerator";
import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
export var state = function () {
  return {
    methods: []
  };
};
export var getters = {
  methods: function methods(state) {
    return state.methods;
  }
};
export var mutations = {
  setMethods: function setMethods(state, payload) {
    state.methods = payload;
  }
};
export var actions = {
  list: function list(_ref) {
    _ref.commit;
    return _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee() {
      return _regeneratorRuntime.wrap(function (_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }))();
  }
};