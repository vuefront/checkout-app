import gql from "graphql-tag";
import { ZonesResult } from "vuefront-api";
import { RootState } from "vuefront-store";
import { MutationTree, GetterTree, ActionTree } from "vuex";

export type State = {
  zones: ZonesResult;
};
export const state: State = {
  zones: {
    content: [],
  },
}

export const getters: GetterTree<State, RootState> = {
  zones(state) {
    return state.zones;
  },
};

export const mutations: MutationTree<State> = {
  setZones(state, payload) {
    state.zones = payload;
  },
};

export const actions: ActionTree<State, RootState> = {
  async zones({ commit, dispatch, rootGetters }, zoneData) {
    await dispatch(
      "apollo/query",
      {
        query: gql`
          query($page: Int, $size: Int, $country_id: String) {
            zonesList(page: $page, size: $size, country_id: $country_id) {
              content {
                id
                name
              }
              totalPages
              totalElements
              first
              last
              number
              numberOfElements
            }
          }
        `,
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
