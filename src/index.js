export default {
  root: {
    components: '@vuefront/checkout-app/lib/components',
    store: '@vuefront/checkout-app/lib/store',
    locales: '@vuefront/checkout-app/lib/locales'
  },
  css: {
    oCheckoutCart: '@vuefront/checkout-app/lib/components/organisms/checkout-cart/checkout-cart.scss',
  },
  extensions: {
    Checkout: 'extensions/checkout/checkout.vue'
  },
  organisms: {
    AccountAddressSelect: 'organisms/account-address-select/account-address-select.vue',
    ShippingAddress: 'organisms/shipping-address/shipping-address.vue',
    PaymentAddress: 'organisms/payment-address/payment-address.vue',
    PaymentMethods: 'organisms/payment-methods/payment-methods.vue',
    ShippingMethods: 'organisms/shipping-methods/shipping-methods.vue',
    CheckoutCart: 'organisms/checkout-cart/checkout-cart.vue'
  },
  locales: {
    'en-gb': ['en-gb'],
    'ru-ru': ['ru-ru']
  },
  store: [
    {
      path: ['store', 'checkout']
    },
    {
      path: ['store', 'checkout', 'paymentAddress'],
      module: 'store/checkout/paymentAddress/paymentAddress.js'
    },
    {
      path: ['store', 'checkout', 'shippingAddress'],
      module: 'store/checkout/shippingAddress/shippingAddress.js'
    },
    {
      path: ['store', 'checkout', 'order'],
      module: 'store/checkout/order/order.js'
    }
  ]
}
