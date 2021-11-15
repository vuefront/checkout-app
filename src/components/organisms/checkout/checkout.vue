<template>
  <div class="vf-e-checkout">
    <vf-o-form :button="false" :errors="v$.$errors" @submit="onSubmit">
      <vf-m-row>
        <vf-m-col md="4" xs="12">
          <vf-o-payment-address
            v-model:address="paymentAddressForm"
            v-model:id="paymentAddressId"
            v-model:delivery="deliveryAddress"
            ref="payment-address"
            error-reference="payment-address"
            :fields="paymentAddress.fields"
            :agree="paymentAddress.agree"
            :countries="countriesList"
            :zones="paymentZones"
            class="mb-3"
          />
          <vf-o-shipping-address
            v-if="!deliveryAddress && shippingAddress.length > 0"
            v-model:address="shippingAddressForm"
            v-model:id="shippingAddressId"
            :delivery="deliveryAddress"
            error-reference="shipping-address"
            :fields="shippingAddress"
            :countries="countriesList"
            :zones="shippingZones"
          />
        </vf-m-col>
        <vf-m-col md="8" xs="12">
          <vf-m-row>
            <vf-m-col md="6" xs="12">
              <vf-o-payment-methods
                error-reference="payment-method"
                :methods="paymentMethods"
                class="mb-3"
                @input="handlePaymentMethod"
              />
            </vf-m-col>
            <vf-m-col md="6" xs="12">
              <vf-o-shipping-methods
                error-reference="shipping-method"
                :methods="shippingMethods"
                class="mb-3"
                @input="handleShippingMethod"
              />
            </vf-m-col>
          </vf-m-row>
          <vf-o-checkout-cart :cart="cart" :totals="totals" />
          <div class="mt-4 text-right">
            <vf-a-button type="submit" color="primary" :disabled="updating">
              {{ $t("modules.store.checkout.buttonConfirm") }}
              <vf-a-icon :icon="mdiArrowRight" />
            </vf-a-button>
          </div>
        </vf-m-col>
      </vf-m-row>
    </vf-o-form>
  </div>
</template>
<script lang="ts" setup>
// @ts-ignore
import useQuery from "vuefront/src/utils/query.ts";
import {
  AddressField,
  Cart,
  CountriesResult,
  PaymentAddressResult,
  PaymentMethod,
  ShippingMethod,
  Total,
  InputField,
} from "vuefront-api";
import {
  computed,
  reactive,
  ref,
  watch,
  PropType,
  onMounted,
  inject,
} from "vue";
import { mdiArrowRight } from "@mdi/js";
import { useStore } from "vuex";
import useVuelidate from "@vuelidate/core";
import { debounce } from "lodash";

const store = useStore();
const v$ = useVuelidate();
const vuefront$ = inject<any>("$vuefront");

const props = defineProps({
  updating: {
    type: Boolean,
    default() {
      return false;
    },
  },
  countriesList: {
    type: Object as PropType<CountriesResult>,
    default() {
      return null;
    },
  },
  paymentMethods: {
    type: Array as PropType<PaymentMethod[]>,
    default() {
      return [];
    },
  },
  shippingMethods: {
    type: Array as PropType<ShippingMethod[]>,
    default() {
      return [];
    },
  },
  paymentAddress: {
    type: Object as PropType<PaymentAddressResult>,
    default() {
      return null;
    },
  },
  totals: {
    type: Array as PropType<Total[]>,
    default() {
      return [];
    },
  },
  shippingAddress: {
    type: Array as PropType<AddressField[]>,
    default() {
      return [];
    },
  },
  cart: {
    type: Object as PropType<Cart>,
    default() {
      return null;
    },
  },
});
const emits = defineEmits(["update", "submit"]);
const paymentAddressForm = ref<InputField[]>([]);
const shippingAddressForm = ref<InputField[]>([]);

const paymentAddressId = ref("");
const shippingAddressId = ref("");

const paymentMethod = ref("");
const shippingMethod = ref("");

const deliveryAddress = ref(true);
const update = () => {
  emits("update", requestData.value);
};
let debounced: any = debounce(update, 1000);

const updating = ref(false);

const paymentZones = computed(
  () => store.getters["store/checkout/paymentAddress/zones"]
);
const shippingZones = computed(
  () => store.getters["store/checkout/shippingAddress/zones"]
);

onMounted(() => {
  if (vuefront$.isClient) {
    setTimeout(() => {
      debounced();
    }, 1000);
  }
});
watch(
  () => props.cart,
  (val, oldVal) => {
    if (val !== oldVal) {
      emits("update", requestData.value);
    }
  },
  { deep: true }
);

const handlePaymentMethod = (val: string) => {
  paymentMethod.value = val;
  debounced();
};
const handleShippingMethod = (val: string) => {
  shippingMethod.value = val;
  debounced();
};

const requestData = computed(() => {
  return {
    paymentAddress: paymentAddressForm.value,
    paymentAddressId: paymentAddressId.value,
    shippingAddress: deliveryAddress.value
      ? paymentAddressForm.value
      : shippingAddressForm.value,
    shippingAddressId: deliveryAddress.value
      ? paymentAddressId.value
      : shippingAddressId.value,
    paymentMethod: paymentMethod.value,
    shippingMethod: shippingMethod.value,
  };
});

const onSubmit = () => {
  v$.value.$touch();
  if (
    !v$.value.$getResultsForChild("payment-address")?.$invalid &&
    !v$.value.$getResultsForChild("shipping-method")?.$invalid &&
    !v$.value.$getResultsForChild("payment-method")?.$invalid
  ) {
    if (
      deliveryAddress.value ||
      (!deliveryAddress.value &&
        !v$.value.$getResultsForChild("shipping-address")?.$invalid)
    ) {
      emits("submit", requestData.value);
    }
  }
};

watch(
  () => requestData.value,
  (val) => {
    emits("update", requestData.value);
  },
  {
    deep: true,
  }
);
</script>
