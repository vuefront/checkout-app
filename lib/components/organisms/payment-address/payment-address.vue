<template>
  <vf-m-card
    class="vf-e-store-checkout__payment_address"
    :title="$t('modules.store.checkout.paymentAddressTitle')"
  >
    <vf-o-account-address-select
      v-if="!hideSelectAddress"
      @input="handleChangeId"
      class="mb-3"
    />
    <template v-if="!id || hideSelectAddress">
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
              v$.form[field.name].$dirty ? !v$.form[field.name].$error : null
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
                :name="field.name"
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
                :options="field.values"
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
                v-else-if="field.type === 'date'"
                v-model="form[field.name]"
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
                :class="form[field.name]"
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
                @update:modelValue="handleChangeCountry"
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
    <vf-a-checkbox
      :model-value="delivery"
      @update:modelValue="handleUpdateDelivery"
    >
      {{ $t(`modules.store.checkout.deliveryAddress`) }}
    </vf-a-checkbox>
    <vf-a-checkbox
      v-if="agree"
      :state="v$.localAgree.$dirty ? !v$.localAgree.$error : null"
      v-model="localAgree"
    >
      <!-- eslint-disable-next-line -->
      <span v-html="agree"></span>
    </vf-a-checkbox>
  </vf-m-card>
</template>
<script lang="ts" setup>
import { useVuelidate, ValidationArgs } from "@vuelidate/core";
import { find } from "lodash";
import { required, helpers, sameAs } from "@vuelidate/validators";
import { ref, computed, PropType, watch, onMounted } from "vue";
import { useStore } from "vuex";
import { AddressField, InputField } from "vuefront-api";
import { useI18n } from "vue-i18n";
const store = useStore();
const i18n = useI18n();
type Schema = Array<number>;
const props = defineProps({
  errorReference: {
    type: String,
    default() {
      return null;
    },
  },
  address: {
    type: Array as PropType<InputField[]>,
    default() {
      return [];
    },
  },
  schema: {
    type: Array as PropType<Schema>,
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
  fields: {
    type: Array as PropType<AddressField[]>,
    default() {
      return [];
    },
  },
  agree: {
    type: String,
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
  id: {
    type: String,
    default() {
      return null;
    },
  },
});
interface Form {
  [x: string]: any;
}
const form: Form = ref({});
const localAgree = ref(false);
if (props.fields) {
  for (let key = 0; key < props.fields.length; key++) {
    let defaultValue: any = null;

    if (props.fields[key].type === "checkbox") {
      defaultValue = [];
    }
    if (props.fields[key].defaultValue) {
      defaultValue = JSON.parse(JSON.stringify(props.fields[key].defaultValue));
    }
    const result = find(props.address, {
      name: props.fields[key].name,
    });
    if (result) {
      try {
        defaultValue = JSON.parse(result.value || "");
        if (typeof defaultValue === "number") {
          defaultValue = result.value;
        }
      } catch (e) {
        defaultValue = result.value;
      }
    }

    form.value[props.fields[key].name] = defaultValue;
  }
}

let validateRules = computed<ValidationArgs>(() => {
  let result: ValidationArgs = {};

  for (let key = 0; key < props.fields.length; key++) {
    if (props.fields[key].required) {
      result[props.fields[key].name] = {
        required: helpers.withMessage(
          i18n.te(`modules.store.checkout.${props.fields[key].name}Error`)
            ? i18n.t(`modules.store.checkout.${props.fields[key].name}Error`)
            : props.fields[key].name,
          required
        ),
      };
    } else {
      result[props.fields[key].name] = {};
    }
  }

  if (props.id) {
    result = {};
  }

  let agreeRule = {};

  if (props.agree) {
    agreeRule = {
      localAgree: {
        sameAs: helpers.withMessage(
          `Warning: You must agree to the Privacy Policy!`,
          sameAs(true)
        ),
      },
    };
  }

  return { form: result, ...agreeRule };
});

const v$ = useVuelidate(
  validateRules,
  { form, localAgree },
  {
    $registerAs: props.errorReference,
  }
);

if (form.value.country_id) {
  store.dispatch("store/checkout/paymentAddress/zones", {
    page: 1,
    size: -1,
    country_id: form.value.country_id,
  });
}

const getFields = computed(() => {
  const result = [];
  let r = 0;
  let countItems = 1;
  let row = [];

  if (r < props.schema.length) {
    countItems = props.schema[r];
  } else if (props.schema.length > 0) {
    countItems = props.schema[props.schema.length - 1];
  }

  for (const key in props.fields) {
    if (row.length === countItems) {
      result.push(row);
      row = [];
      r++;
      if (r < props.schema.length) {
        countItems = props.schema[r];
      } else if (props.schema.length > 0) {
        countItems = props.schema[props.schema.length - 1];
      }
    }

    if (props.fields[key]) row.push(props.fields[key]);
  }

  if (row.length > 0) {
    result.push(row);
  }

  return result;
});

const getAddressFields = () => {
  let result: { name: string; value: any }[] = [];
  for (const key in form.value) {
    if ((form.value as any)[key]) {
      result = [
        ...result,
        {
          name: key,
          value:
            typeof (form.value as any)[key] !== "string" &&
            (form.value as any)[key] !== null
              ? JSON.stringify((form.value as any)[key])
              : (form.value as any)[key],
        },
      ];
    }
  }

  return result;
};

const emits = defineEmits(["update:id", "update:address", "update:delivery"]);
watch(
  () => form.value,
  (value) => {
    emits("update:address", getAddressFields());
  },
  {
    deep: true,
  }
);

const handleChangeId = (val: string) => {
  emits("update:id", val);
};
const handleUpdateDelivery = (val: boolean) => {
  emits("update:delivery", val);
};
onMounted(() => {
  emits("update:address", getAddressFields());
});

const handleChangeCountry = async (value: string) => {
  await store.dispatch("store/checkout/paymentAddress/zones", {
    page: 1,
    size: -1,
    country_id: value,
  });
};
</script>
