<template>
  <vf-m-card
    class="vf-e-store-checkout__shipping_address"
    :title="$t('modules.store.checkout.shippingAddressTitle')"
  >
  <vf-o-account-address-select class="mb-3" v-model="selectedAddress"/>
    <template v-if="!selectedAddress">
      <vf-m-field
        v-for="(value, index) in address"
        :id="`input-shipping-address-${value.name}`"
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
        <template #error>
          <span v-if="!value.label">
            {{$t(`modules.store.checkout.${value.name}Error`)}}
          </span>
          <span v-else>
            {{value.label}} {{$t(`modules.store.checkout.requiredError`)}}
          </span>
          </template>
      </vf-m-field>
    </template>
  </vf-m-card>
</template>
<script>
import { validationMixin } from "vuelidate";
import required from "vuelidate/lib/validators/required";
import minLength from "vuelidate/lib/validators/minLength";
import maxLength from "vuelidate/lib/validators/maxLength";
export default {
  mixins: [validationMixin],
  props: {
    address: {
      type: Array,
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
    }
  },
  watch: {
    form: {
      handler(value, oldValue) {
        this.$emit('input', {address: value, addressId: this.selectedAddress})
      },
      deep: true
    },
    selectedAddress: {
      handler(value, oldValue) {
        this.$emit('input', {address: this.form, addressId: value})
      },
      deep: true
    },
  },
  data () {
    let form = {}
    for (const key in this.address) {
      form[this.address[key].name] = this.address[key].defaultValue ? this.address[key].defaultValue : null
    }

    if(form.country_id) {
      this.$store.dispatch("store/checkout/paymentAddress/zones", {
        page: 1,
        size: -1,
        country_id: form.country_id
      });
    }

    return {
      form,
      selectedAddress: null
    }
  },
  validations() {
    let fields = {};


    if(this.selectedAddress) {
      return {
        form: {
          
        }
      }
    }

    for (const key in this.address) {
      fields[this.address[key].name] = {}
      if(this.address[key].required) {
        fields[this.address[key].name]['required'] = required
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
      await this.$store.dispatch("store/checkout/shippingAddress/zones", {
        page: 1,
        size: -1,
        country_id: value
      });
    },
  }
}
</script>
