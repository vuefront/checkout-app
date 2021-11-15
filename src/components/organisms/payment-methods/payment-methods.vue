<template>
  <vf-m-card
    class="vf-o-payment-methods"
    :title="$t('modules.store.checkout.paymentMethodsTitle')"
  >
    <div v-for="item in methods" :key="item.id">
      <vf-a-radio
        v-model="method"
        name="payment-method"
        :value="item.codename"
        :state="v$.method.$dirty ? !v$.method.$error : null"
        >{{ item.name }}</vf-a-radio
      >
    </div>
  </vf-m-card>
</template>
<script setup lang="ts">
import { useVuelidate } from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { watch, ref, PropType, onMounted } from "vue";
import { PaymentMethod } from "vuefront-api";
import { useI18n } from "vue-i18n";
const i18n = useI18n();
const props = defineProps({
  errorReference: {
    type: String,
    default() {
      return null;
    },
  },
  value: {
    type: String,
    default() {
      return null;
    },
  },
  autoSelect: {
    type: Boolean,
    default() {
      return false;
    },
  },
  methods: {
    type: Array as PropType<PaymentMethod[]>,
    default() {
      return [];
    },
  },
});
const emits = defineEmits(["input"]);
const method = ref(props.value);
watch(
  () => method.value,
  (value) => {
    emits("input", value);
  }
);

onMounted(() => {
  if (props.autoSelect && props.methods.length > 0) {
    if (!props.value) {
      method.value = props.methods[0].codename;
    }
  }
});
const v$ = useVuelidate(
  {
    method: {
      required: helpers.withMessage(
        i18n.t("modules.store.checkout.paymentMethodsError"),
        required
      ),
    },
  },
  { method },
  {
    $registerAs: props.errorReference,
  }
);
</script>
