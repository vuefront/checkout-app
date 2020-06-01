<template>
  <vf-m-card
    class="vf-e-store-checkout__payment_address"
    :title="$t('modules.store.checkout.paymentAddressTitle')"
  >
    <vf-m-field
      v-for="(value, index) in address.fields"
      :id="`input-payment-address-${value.name}`"
      :state="$v.form[value.name].$dirty ? !$v.form[value.name].$error : null"
      :key="index"
    >
      <template #label>
        <span v-if="!value.label">
          {{$t(`modules.store.checkout.${value.name}`)}}
        </span>
        <span v-else>
          {{value.label}}
        </span>
      </template>
      <template #default="data">
        <vf-a-input v-if="value.type === 'text'" v-model="form[value.name]" v-bind="data" trim />
        <vf-a-input v-if="value.type === 'datetime'" type="datetime-local" v-model="form[value.name]" v-bind="data" trim />
        <vf-a-textarea v-else-if="value.type === 'textarea'" v-model="form[value.name]" v-bind="data" trim />
        <vf-a-select v-else-if="value.type === 'select'" v-model="form[value.name]" :options="value.values" v-bind="data" no-select />
        <vf-a-radio-group v-else-if="value.type === 'radio'" v-model="form[value.name]" :options="value.values" v-bind="data" stacked />
        <vf-a-checkbox-group v-else-if="value.type === 'checkbox'" v-model="form[value.name]" :options="value.values" v-bind="data" stacked />
        <vf-a-datepicker v-else-if="value.type === 'date'" v-model="form[value.name]" v-bind="data" />
        <vf-a-timepicker v-else-if="value.type === 'time'" v-model="form[value.name]" v-bind="data" />
        <vf-a-select
          v-model="form[value.name]"
          v-else-if="value.type === 'zone'"
          v-bind="data"
          :options="zones.content"
          value-field="id"
          text-field="name"
          no-select
        />
        <vf-a-select
          v-model="form[value.name]"
          v-else-if="value.type === 'country'"
          v-bind="data"
          :options="countries.content"
          value-field="id"
          text-field="name"
          no-select
          @input="handleChangeCountry"
        />
      </template>
      <template #error>{{
        $te(`modules.store.checkout.${value.name}Error`) ?
        $t(`modules.store.checkout.${value.name}Error`):
        value.name}}</template>
    </vf-m-field>
    <vf-a-checkbox v-if="delivery" v-model="deliveryAddress" >
      {{$t(`modules.store.checkout.deliveryAddress`)}}
    </vf-a-checkbox>
    <vf-a-checkbox v-model="agree" v-if="address.agree" >
      <span v-html="address.agree"></span>
    </vf-a-checkbox>
  </vf-m-card>
</template>
<script>
import { validationMixin } from "vuelidate";
import required from "vuelidate/lib/validators/required";
import minLength from "vuelidate/lib/validators/minLength";
import maxLength from "vuelidate/lib/validators/maxLength";
export default {
  mixins: [validationMixin],
  fragments:{
    fields:  `
      paymentAddress {
        agree
        fields {
          type
          name
          label
          required
          values {
            text
            value
          }
        }
      }`
  },
  props: {
    address: {
      type: Object,
      default () {
        return null
      }
    },
    countries: {
      type: Object,
      default () {
        return null
      }
    },
    zones: {
      type: Object,
      default () {
        return null
      }
    },
    delivery: {
      type: Boolean,
      default () {
        return true
      }
    }
  },
  data () {
    let form = {}
    for (const key in this.address.fields) {
      form[this.address.fields[key].name] = null
    }
    return {
      deliveryAddress: true,
      agree: null,
      form
    }
  },
  watch: {
    form: {
      handler(value, oldValue) {
        this.$emit('input', value)
      },
      deep: true
    },
    deliveryAddress(value, oldValue) {
      if(value !== oldValue) {
        this.$emit('updateDeliveryAddress', value)
      }
    }
  },
  validations() {
    let fields = {};

    for (const key in this.address.fields) {
      fields[this.address.fields[key].name] = {}
      if(this.address.fields[key].required) {
        fields[this.address.fields[key].name]['required'] = required
      }
    }

    return {
      form: {
        ...fields
      }
    };
  },
  methods: {
    async handleChangeCountry(value) {
      await this.$store.dispatch("store/checkout/paymentAddress/zones", {
        page: 1,
        size: -1,
        country_id: value
      });
    },
  }
}
</script>
