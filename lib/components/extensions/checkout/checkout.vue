<template>
  <div class="vf-e-checkout">
    <vf-o-checkout
      v-if="!loading"
      :updating="updating"
      @update="updateOrder"
      @submit="onSubmit"
      v-bind="response"
      :cart="cart"
    />
    <vf-a-loader v-else />
  </div>
</template>
<script lang="ts" setup>
// @ts-ignore
import useQuery from "vuefront/src/utils/query.ts";
import { isEmpty } from "lodash";
import { computed, inject, nextTick, ref } from "vue";
import { useStore } from "vuex";

const { query } = useQuery();
const store = useStore();

const vfapollo = inject<any>("$vfapollo");

let response = ref<any>(null);
const updating = ref(false);
const loading = ref(true);

const cart = computed(() => store.getters["store/cart/get"]);
const url = computed(() => store.getters["store/checkout/order/url"]);
const error = computed(() => store.getters["vuefront/error"]);

const handleLoad = async () => {
  await store.dispatch("store/checkout/order/create");
  const { data } = await vfapollo.query({
    query,
  });
  store.commit("store/cart/setCart", data.cart);
  nextTick(() => {
    response.value = data;
    loading.value = false;
  });
};

const updateOrder = async (e: any) => {
  updating.value = true;
  const data = await store.dispatch("store/checkout/order/update", e);
  if (data) {
    response.value = { ...response.value, ...data.updateOrder };
  }
  updating.value = false;
};
const onSubmit = async () => {
  updating.value = true;
  await store.dispatch("store/checkout/order/confirm");
  updating.value = false;

  if (isEmpty(error.value)) {
    window.location.href = url.value;
  }
};
handleLoad();
</script>
<graphql>
{
  countriesList(page: 1, size: -1) {
    content {
      id
      name
    }
  }
  paymentMethods {
    id
    codename
    name
  }
  shippingMethods {
    id
    codename
    name
  }
	paymentAddress {
    agree
    fields {
      type
      name
      label
      required
      defaultValue
      values {
        text
        value
      }
    }
  }
  totals {
    title
    text
  }
  shippingAddress {
    type
    name
    label
    required
    defaultValue
    values {
      text
      value
    }
  }
  cart {
      products {
          key
          quantity
          total
          option {
              name
              value
              type
          }
          product {
              id
              name
              model
              price
              image
              imageLazy
              manufacturer {
                id
                name
                url(url: "/store/manufacturer/_id")
              }
          }
      }
      total
  }
}
</graphql>
