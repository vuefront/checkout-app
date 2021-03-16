import CreateGql from "./create.graphql";
import UpdateGql from "./update.graphql";
import ConfirmGql from "./confirm.graphql";
export const state = () => ({
  order: {},
  url: "",
});

export const getters = {
  order(state) {
    return state.order;
  },
  url(state) {
    return state.url;
  },
};

export const mutations = {
  setOrder(state, payload) {
    state.order = payload;
  },
  setUrl(state, payload) {
    state.url = payload;
  },
};

export const actions = {
  async create({ commit, dispatch, rootGetters }, payload) {
    await dispatch(
      "apollo/mutate",
      {
        mutation: CreateGql,
        variables: payload,
      },
      {
        root: true,
      }
    );
    if (!rootGetters["vuefront/error"]) {
      commit("setOrder", rootGetters["apollo/get"].createOrder.order);
      commit("setUrl", rootGetters["apollo/get"].createOrder.url);
    }
  },
  async update({ commit }, payload) {
    try {
      const { data } = await this.$vfapollo.mutate({
        mutation: UpdateGql,
        variables: payload,
      });

      return data;
    } catch (e) {
      commit("vuefront/setResponseError", e, { root: true });
    }
  },
  async confirm({ commit }) {
    try {
      const { data } = await this.$vfapollo.mutate({
        mutation: ConfirmGql,
        variables: {},
      });

      commit("setOrder", data.confirmOrder.order);
      commit("setUrl", data.confirmOrder.url);
    } catch (e) {
      commit("vuefront/setResponseError", e, { root: true });
    }
  },
};
