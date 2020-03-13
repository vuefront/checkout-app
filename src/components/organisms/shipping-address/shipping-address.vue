<template>
  <vf-m-card
    class="vf-e-store-checkout__shipping_address"
    :title="$t('modules.store.checkout.shippingAddressTitle')"
  >
    <vf-m-field
      v-for="(value, index) in address"
      :id="`input-shipping-address-${value.name}`"
      :key="index"
    >
      <template #label>{{$t(`modules.store.checkout.${value.name}`)}}</template>
      <template #default="data">
        <vf-a-input v-if="value.type === 'text'" v-bind="data" trim />
        <vf-a-textarea v-else-if="value.type === 'textarea'" v-bind="data" trim />
        <vf-a-select v-else-if="value.type === 'select'" v-bind="data" trim />
        <vf-a-select
          v-else-if="value.type === 'country'"
          v-bind="data"
          :options="countries.content"
          value-field="id"
          text-field="name"
          trim
        />
      </template>
      <template #error>{{$t(`modules.store.checkout.${value.name}Error`)}}</template>
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
  }
}
</script>
