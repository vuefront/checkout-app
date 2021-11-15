import gql from "graphql-tag";
import { ConfirmOrderResult } from "vuefront-api";
import { RootState } from "vuefront-store";
import { ActionTree, GetterTree, MutationTree } from "vuex";
export type State = {
  order: ConfirmOrderResult | null;
  url: string;
};
export const state: State = {
  order: null,
  url: "",
};

export const getters: GetterTree<State, RootState> = {
  order(state) {
    return state.order;
  },
  url(state) {
    return state.url;
  },
};

export const mutations: MutationTree<State> = {
  setOrder(state, payload) {
    state.order = payload;
  },
  setUrl(state, payload) {
    state.url = payload;
  },
};

export const actions: ActionTree<State, RootState> = {
  async create({ commit }) {
    try {
      await this.$vfapollo.mutate({
        mutation: gql`
          mutation {
            createOrder {
              success
            }
          }
        `,
      });
    } catch (e) {
      commit("vuefront/setResponseError", e, { root: true });
    }
  },
  async update({ commit }, payload) {
    try {
      const { data } = await this.$vfapollo.mutate({
        mutation: gql`
          mutation (
            $paymentAddress: [InputField]
            $paymentAddressId: String
            $shippingAddressId: String
            $shippingAddress: [InputField]
            $paymentMethod: String
            $shippingMethod: String
          ) {
            updateOrder(
              paymentAddress: $paymentAddress
              shippingAddress: $shippingAddress
              shippingAddressId: $shippingAddressId
              paymentAddressId: $paymentAddressId
              paymentMethod: $paymentMethod
              shippingMethod: $shippingMethod
            ) {
              shippingMethods {
                id
                codename
                name
              }
              totals {
                title
                text
              }
            }
          }
        `,
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
        mutation: gql`
          mutation {
            confirmOrder {
              order {
                id
              }
              url
            }
          }
        `,
        variables: {},
      });

      commit("setOrder", data.confirmOrder.order);
      commit("setUrl", data.confirmOrder.url);
    } catch (e) {
      commit("vuefront/setResponseError", e, { root: true });
    }
  },
};
