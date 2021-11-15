import gql from "graphql-tag";
import { ZonesResult } from "vuefront-api";
import { RootState } from "vuefront-store";
import { ActionTree, GetterTree, MutationTree } from "vuex";
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
  async zones({ commit }, zoneData) {
    try {
      const { data } = await this.$vfapollo.query({
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
      });
      commit("setZones", data.zonesList);
    } catch (e) {
      commit("vuefront/setResponseError", e, { root: true });
    }
  },
};
