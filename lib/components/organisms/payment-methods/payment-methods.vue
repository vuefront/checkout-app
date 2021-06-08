<template>
  <vf-m-card
    class="vf-o-payment-methods"
    :title="$t('modules.store.checkout.paymentMethodsTitle')"
  >
    <div v-for="value in methods" :key="value.id">
      <vf-a-radio
        v-model="method"
        name="payment-method"
        :value="value.codename"
        :state="$v.method.$dirty ? !$v.method.$error : null"
        >{{ value.name }}</vf-a-radio
      >
    </div>
  </vf-m-card>
</template>
<script>
import { validationMixin } from "vuelidate";
import required from "vuelidate/lib/validators/required";
export default {
  mixins: [validationMixin],
  props: {
    autoSelect: {
      type: Boolean,
      default() {
        return false;
      },
    },
    methods: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      method: null,
    };
  },
  watch: {
    method(value) {
      this.$emit("input", value);
    },
  },
  mounted() {
    if (this.autoSelect && this.methods.length > 0) {
      this.method = this.methods[0].codename;
    }
  },
  validations() {
    return {
      method: {
        required,
      },
    };
  },
};
</script>
