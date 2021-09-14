<template>
  <vf-m-card
    class="vf-e-store-checkout__payment_address"
    :title="$t('modules.store.checkout.paymentAddressTitle')"
  >
    <vf-o-account-address-select
      v-if="!hideSelectAddress"
      v-model="selectedAddress"
      class="mb-3"
    />
    <template v-if="!selectedAddress || hideSelectAddress">
      <vf-m-row v-for="(row, rowKey) in getFields" :key="`row_${rowKey}`">
        <vf-m-col
          v-for="(field, index) in row"
          :key="`col_${rowKey}_${index}`"
          xs="12"
          :md="12 / row.length"
        >
          <vf-m-field
            :id="`input-payment-address-${field.name}`"
            :state="
              $v.form[field.name].$dirty ? !$v.form[field.name].$error : null
            "
          >
            <template #label>
              <span v-if="!field.label">
                {{ $t(`modules.store.checkout.${field.name}`) }}
              </span>
              <span v-else>
                {{ field.label }}
              </span>
            </template>
            <template #default="data">
              <vf-a-input
                v-if="field.type === 'text'"
                v-model="form[field.name]"
                v-bind="data"
                trim
              />
              <vf-a-input
                v-if="field.type === 'datetime'"
                v-model="form[field.name]"
                type="datetime-local"
                v-bind="data"
                trim
              />
              <vf-a-textarea
                v-else-if="field.type === 'textarea'"
                v-model="form[field.name]"
                v-bind="data"
                trim
              />
              <vf-a-select
                v-else-if="field.type === 'select'"
                v-model="form[field.name]"
                :options="value.values"
                v-bind="data"
                no-select
              />
              <vf-a-radio-group
                v-else-if="field.type === 'radio'"
                v-model="form[field.name]"
                :options="field.values"
                v-bind="data"
                stacked
              />
              <vf-a-checkbox-group
                v-else-if="field.type === 'checkbox'"
                v-model="form[field.name]"
                :options="field.values"
                v-bind="data"
                stacked
              />
              <vf-a-datepicker
                v-else-if="value.type === 'date'"
                v-model="form[value.name]"
                v-bind="data"
              />
              <vf-a-timepicker
                v-else-if="field.type === 'time'"
                v-model="form[field.name]"
                v-bind="data"
              />
              <vf-a-select
                v-else-if="field.type === 'zone'"
                v-model="form[field.name]"
                v-bind="data"
                :options="zones.content"
                value-field="id"
                text-field="name"
                no-select
              />
              <vf-a-select
                v-else-if="field.type === 'country'"
                v-model="form[field.name]"
                v-bind="data"
                :options="countries.content"
                value-field="id"
                text-field="name"
                no-select
                @input="handleChangeCountry"
              />
            </template>
            <template #error>{{
              $te(`modules.store.checkout.${field.name}Error`)
                ? $t(`modules.store.checkout.${field.name}Error`)
                : field.name
            }}</template>
          </vf-m-field>
        </vf-m-col>
      </vf-m-row>
    </template>
    <vf-a-checkbox v-if="delivery" v-model="deliveryAddress">
      {{ $t(`modules.store.checkout.deliveryAddress`) }}
    </vf-a-checkbox>
    <vf-a-checkbox v-if="address.agree" v-model="agree">
      <!-- eslint-disable-next-line -->
      <span v-html="address.agree"></span>
    </vf-a-checkbox>
  </vf-m-card>
</template>
<script lang="ts" setup>
import { validationMixin } from "vuelidate";
import find from "lodash/find";
import required from "vuelidate/lib/validators/required";
import {defineProps, ref} from "vue";
import {useStore} from "vuex";
const store = useStore()
const props = defineProps({
  value: {
    type: Array,
    default() {
      return [];
    },
  },
  schema: {
    type: Array,
    default() {
      return [1];
    },
  },
  hideSelectAddress: {
    type: Boolean,
    default() {
      return false;
    },
  },
  address: {
    type: Object,
    default() {
      return null;
    },
  },
  countries: {
    type: Object,
    default() {
      return null;
    },
  },
  zones: {
    type: Object,
    default() {
      return null;
    },
  },
  delivery: {
    type: Boolean,
    default() {
      return true;
    },
  },
});
const form = {};
for (const key in props.address.fields) {
  let defaultValue = null;
  if (props.address.fields[key].type === "checkbox") {
    defaultValue = [];
  }
  if (props.address.fields[key].defaultValue) {
    defaultValue = props.address.fields[key].defaultValue;
  }
  const fieldValue = find(props.value, {
    name: props.address.fields[key].name,
  });

  if (fieldValue) {
    try {
      defaultValue = JSON.parse(fieldValue.value);
      if (typeof defaultValue === "number") {
        defaultValue = fieldValue.value;
      }
    } catch (e) {
      defaultValue = fieldValue.value;
    }
  }

  form[props.address.fields[key].name] = defaultValue;
}

if (form.country_id) {
  store.dispatch("store/checkout/paymentAddress/zones", {
    page: 1,
    size: -1,
    country_id: form.country_id,
  });
}

const selectedAddress = ref(null)
const deliveryAddress = ref(true)
const agree = ref(null)
export default {
  mixins: [validationMixin],
  computed: {
    getFields() {
      const result = [];
      let r = 0;
      const c = 0;
      let countItems = 1;
      let row = [];

      if (r < this.schema.length) {
        countItems = this.schema[r];
      } else if (this.schema.length > 0) {
        countItems = this.schema[this.schema.length - 1];
      }

      for (const key in this.address.fields) {
        if (row.length === countItems) {
          result.push(row);
          row = [];
          r++;
          if (r < this.schema.length) {
            countItems = this.schema[r];
          } else if (this.schema.length > 0) {
            countItems = this.schema[this.schema.length - 1];
          }
        }

        row.push(this.address.fields[key]);
      }

      if (row.length > 0) {
        result.push(row);
      }

      return result;
    },
  },
  watch: {
    form: {
      handler(value, oldValue) {
        this.$emit("input", {
          addressId: this.selectedAddress,
          address: value,
        });
      },
      deep: true,
    },
    selectedAddress: {
      handler(value, oldValue) {
        this.$emit("input", { addressId: value, address: this.form });
      },
      deep: true,
    },
    deliveryAddress(value, oldValue) {
      if (value !== oldValue) {
        this.$emit("updateDeliveryAddress", value);
      }
    },
  },
  mounted() {
    this.$emit("input", {
      addressId: this.selectedAddress,
      address: this.form,
    });
  },
  validations() {
    const fields = {};

    if (this.selectedAddress) {
      return {
        form: {},
      };
    }

    for (const key in this.address.fields) {
      fields[this.address.fields[key].name] = {};
      if (this.address.fields[key].required) {
        fields[this.address.fields[key].name].required = required;
      }
    }

    return {
      form: {
        ...fields,
      },
    };
  },
  methods: {
    async handleChangeCountry(value) {
      await this.$store.dispatch("store/checkout/paymentAddress/zones", {
        page: 1,
        size: -1,
        country_id: value,
      });
    },
  },
};
</script>
