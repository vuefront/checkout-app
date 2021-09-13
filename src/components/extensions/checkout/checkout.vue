<template>
  <div class="vf-e-checkout">
    <vf-o-form v-if="!loading" :button="false" @submit="onSubmit">
      <vf-m-row>
        <vf-m-col md="4" xs="12">
          <vf-o-payment-address
            ref="paymentAddress"
            :delivery="response.shippingAddress.length > 0"
            :address="response.paymentAddress"
            :countries="response.countriesList"
            :zones="paymentZones"
            class="mb-3"
            @updateDeliveryAddress="deliveryAddress = $event"
            @input="updatePaymentAddress"
          />
          <vf-o-shipping-address
            v-if="!deliveryAddress && response.shippingAddress.length > 0"
            ref="shippingAddress"
            :address="response.shippingAddress"
            :countries="response.countriesList"
            :zones="shippingZones"
            @input="updateShippingAddress"
          />
        </vf-m-col>
        <vf-m-col md="8" xs="12">
          <vf-m-row>
            <vf-m-col md="6" xs="12">
              <vf-o-payment-methods
                ref="paymentMethods"
                :methods="response.paymentMethods"
                class="mb-3"
                @input="handlePaymentMethod"
              />
            </vf-m-col>
            <vf-m-col md="6" xs="12">
              <vf-o-shipping-methods
                ref="shippingMethods"
                :methods="response.shippingMethods"
                class="mb-3"
                @input="handleShippingMethod"
              />
            </vf-m-col>
          </vf-m-row>
          <vf-o-checkout-cart :cart="cart" :totals="response.totals" />
          <div class="mt-4 text-right">
            <vf-a-button type="submit" color="primary" :disabled="updating">
              {{ $t("modules.store.checkout.buttonConfirm") }}
              <vf-a-icon :icon="mdiArrowRight" />
            </vf-a-button>
          </div>
        </vf-m-col>
      </vf-m-row>
    </vf-o-form>
    <vf-a-loader v-else />
  </div>
</template>
<script lang="ts" setup>
import useQuery from "vuefront/lib/utils/query";
import debounce from "lodash-es/debounce";
import isEmpty from "lodash/isEmpty";
import {
  computed,
  inject,
  nextTick,
  onMounted,
  reactive,
  ref,
  watch,
} from "vue";
import { mdiArrowRight } from "@mdi/js";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import useVuelidate from "@vuelidate/core";

const v$ = useVuelidate();
const vfapollo = inject<any>("$vfapollo");
const { query } = useQuery();
let paymentAddress = reactive({});
let shippingAddress = reactive({});
let response = reactive({
  shippingAddress: [],
});
let debounced: any = () => {};
const updating = ref(false);
const loading = ref(true);
const paymentMethod = ref("");
const paymentAddressId = ref("");
const shippingMethod = ref("");
const shippingAddressId = ref("");
const store = useStore();
const url = computed(() => store.getters["store/checkout/order/url"]);
const error = computed(() => store.getters["vuefront/error"]);
const cart = computed(() => store.getters["store/cart/get"]);
const paymentZones = computed(
  () => store.getters["store/checkout/paymentAddress/zones"]
);
const deliveryAddress = ref(true);
const router = useRouter();
const shippingZones = computed(
  () => store.getters["store/checkout/shippingAddress/zones"]
);
const paymentAddressData = computed(() => {
  let result = [];
  for (const key in paymentAddress) {
    result = [
      ...result,
      {
        name: key,
        value:
          typeof paymentAddress[key] !== "string" &&
          paymentAddress[key] !== null
            ? JSON.stringify(paymentAddress[key])
            : paymentAddress[key],
      },
    ];
  }

  return result;
});

const handleLoad = async () => {
  await store.dispatch("store/checkout/order/create");
  const { data } = await vfapollo.query({
    query,
  });
  store.commit("store/cart/setCart", data.cart);
  response = data;
  loading.value = false;
};

const shippingAddressData = () => {
  let result: any = [];

  if (deliveryAddress) {
    result = paymentAddressData;
  } else {
    for (const key in this.shippingAddress) {
      result = [
        ...result,
        {
          name: key,
          value:
            typeof shippingAddress[key] !== "string" &&
            shippingAddress[key] !== null
              ? JSON.stringify(shippingAddress[key])
              : shippingAddress[key],
        },
      ];
    }
  }

  return result;
};

const shippingAddressIdData = () => {
  let result = null;

  if (deliveryAddress.value) {
    result = paymentAddressId.value;
  } else {
    result = shippingAddressId.value;
  }

  return result;
};

onMounted(() => {
  handleLoad().then(() => {
    setTimeout(() => {
      debounced = debounce(updateOrder, 1000);
    }, 1000);
  });
});

watch(
  () => cart,
  (val, oldVal) => {
    if (val !== oldVal) {
      debounced();
    }
  },
  { deep: true }
);

const handlePaymentMethod = (val) => {
  paymentMethod.value = val;
  debounced();
};
const handleShippingMethod = (val) => {
  shippingMethod.value = val;
  debounced();
};
const updatePaymentAddress = ({ addressId, address }) => {
  paymentAddress = address;
  paymentAddressId.value = addressId;
  debounced();
};
const updateShippingAddress = ({ addressId, address }) => {
  shippingAddressId.value = addressId;
  shippingAddress = address;
  debounced();
};

const updateOrder = async () => {
  updating.value = true;
  const data = await store.dispatch("store/checkout/order/update", {
    paymentAddress: paymentAddressData.value,
    paymentAddressId: paymentAddressId.value,
    shippingAddress: shippingAddressData,
    shippingAddressId: shippingAddressIdData,
    paymentMethod: paymentMethod.value,
    shippingMethod: shippingMethod.value,
  });
  if (data) {
    response = { ...response, ...data.updateOrder };
  }
  updating.value = false;
};

const refs = ref([]);
console.log(refs);
// const onSubmit = async () => {
//   this.$refs.paymentAddress.$v.$touch();
//   this.$refs.paymentMethods.$v.$touch();
//   this.$refs.shippingMethods.$v.$touch();
//
//   if (!this.deliveryAddress) {
//     this.$refs.shippingAddress.$v.$touch();
//   }
//
//   if (
//     !this.$refs.paymentAddress.$v.form.$invalid &&
//     !this.$refs.shippingMethods.$v.method.$invalid &&
//     !this.$refs.paymentMethods.$v.method.$invalid
//   ) {
//     if (
//       deliveryAddress ||
//       (!deliveryAddress && !this.$refs.shippingAddress.$v.form.$invalid)
//     ) {
//       updating.value = true;
//       await store.dispatch("store/checkout/order/confirm");
//       updating.value = false;
//
//       if (isEmpty(error)) {
//         window.location.href = url.value;
//       }
//     }
//   }
// };
const handleLoaded = (response) => {
  if (response.cart.products.length === 0) {
    router.push("/store/cart");
  }
  store.commit("store/cart/setCart", response.cart);
  nextTick(() => {
    response = { ...response };
  });
};
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
