<template>
  <vf-m-card
    class="vf-e-store-checkout__payment_address"
    :title="$t('modules.store.checkout.paymentAddressTitle')"
  >
    <vf-m-field
      v-for="(value, index) in address"
      :id="`input-payment-address-${value.name}`"
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
        <vf-a-textarea v-else-if="value.type === 'textarea'" v-model="form[value.name]" v-bind="data" trim />
        <vf-a-select v-else-if="value.type === 'select'" v-model="form[value.name]" :options="value.values" v-bind="data" no-select />
        <vf-a-radio-group v-else-if="value.type === 'radio'" v-model="form[value.name]" :options="value.values" v-bind="data" stacked />
        <vf-a-checkbox-group v-else-if="value.type === 'checkbox'" v-model="form[value.name]" :options="value.values" v-bind="data" stacked />
        <vf-a-datepicker v-else-if="value.type === 'date'" v-model="form[value.name]" v-bind="data" />
        <vf-a-timepicker v-else-if="value.type === 'time'" v-model="form[value.name]" v-bind="data" />
        <vf-a-select
          v-model="form[value.name]"
          v-else-if="value.type === 'country'"
          v-bind="data"
          :options="countries.content"
          value-field="id"
          text-field="name"
          no-select
        />
      </template>
      <template #error>{{
        $te(`modules.store.checkout.${value.name}Error`) ?
        $t(`modules.store.checkout.${value.name}Error`):
        value.name}}</template>
    </vf-m-field>
  </vf-m-card>
</template>
<script>
export default {
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
    }
  },
  data () {
    let form = {}
    for (const key in this.address) {
      form[this.address[key].name] = null
    }
    return {
      form
    }
  }
}
</script>
