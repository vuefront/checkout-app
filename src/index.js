export default {
    root: {
      components: '@vuefront/checkout-app/lib/components',
      locales: '@vuefront/checkout-app/lib/locales'
    },
    extensions: {
      Checkout: 'extensions/checkout/checkout.vue'
    },
    organisms: {
      ShippingAddress: 'organisms/shipping-address/shipping-address.vue',
      PaymentAddress: 'organisms/payment-address/payment-address.vue'
    },
    locales: {
      'en-gb': ['en-gb'],
      'ru-ru': ['ru-ru']
  }
}