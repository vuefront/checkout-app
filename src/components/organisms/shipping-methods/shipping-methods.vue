<template>
  <vf-m-card
    v-show="methods.length > 0"
    class="vf-o-shipping-methods"
    :title="$t('modules.store.checkout.shippingMethodsTitle')"
  >
    <div v-for="value in methods" :key="value.id">
      <vf-a-radio
        v-model="method"
        name="shipping-method"
        :state="v$.method.$dirty ? !v$.method.$error : null"
        :value="value.codename"
        >{{ value.name }}</vf-a-radio
      >
    </div>
  </vf-m-card>
</template>
<script lang="ts" setup>
import { useVuelidate } from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { ref, watch, onMounted, PropType } from "vue";
import { ShippingMethod } from "vuefront-api";
import { useI18n } from "vue-i18n";
const i18n = useI18n();
const props = defineProps({
  errorReference: {
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
    type: Array as PropType<ShippingMethod[]>,
    default() {
      return [];
    },
  },
});
const method = ref<string | null>(null);
const emits = defineEmits(["input"]);
watch(
  () => method.value,
  (value) => {
    emits("input", value);
  }
);

onMounted(() => {
  if (props.autoSelect && props.methods.length > 0) {
    method.value = props.methods[0].codename;
  }
});
const v$ = useVuelidate(
  {
    method: {
      required: helpers.withMessage(
        i18n.t("modules.store.checkout.shippingMethodsError"),
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
