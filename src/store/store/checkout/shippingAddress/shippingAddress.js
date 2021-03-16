import ZonesGql from "./list.graphql";

export const state = () => ({
  zones: {
    content: [],
  },
});

export const getters = {
  zones(state) {
    return state.zones;
  },
};

export const mutations = {
  setZones(state, payload) {
    state.zones = payload;
  },
};

export const actions = {
  async zones({ commit, dispatch, rootGetters }, zoneData) {
    await dispatch(
      "apollo/query",
      {
        query: ZonesGql,
        variables: zoneData,
      },
      {
        root: true,
      }
    );
    if (!rootGetters["vuefront/error"]) {
      commit("setZones", rootGetters["apollo/get"].zonesList);
    }
  },
};
