module.exports = {
  root: {
    components: "@vuefront/checkout-app/lib/components",
    store: "@vuefront/checkout-app/lib/store",
    locales: "@vuefront/checkout-app/lib/locales",
  },
  extensions: {
    Checkout: "extensions/checkout/checkout.vue",
  },
  organisms: {
    Checkout: "organisms/checkout/checkout.vue",
    AccountAddressSelect:
      "organisms/account-address-select/account-address-select.vue",
    ShippingAddress: "organisms/shipping-address/shipping-address.vue",
    PaymentAddress: "organisms/payment-address/payment-address.vue",
    PaymentMethods: "organisms/payment-methods/payment-methods.vue",
    ShippingMethods: "organisms/shipping-methods/shipping-methods.vue",
    CheckoutCart: {
      css: "organisms/checkout-cart/checkout-cart.scss",
      component: "organisms/checkout-cart/checkout-cart.vue",
    },
    CheckoutCartProduct: {
      css: "organisms/checkout-cart-product/checkout-cart-product.scss",
      component: "organisms/checkout-cart-product/checkout-cart-product.vue",
    },
  },
  locales: {
    "en-gb": ["en-gb/index.mjs"],
    "ru-ru": ["en-gb/index.mjs"],
  },
  store: [
    {
      path: ["store", "checkout"],
    },
    {
      path: ["store", "checkout", "paymentAddress"],
      module: "store/checkout/paymentAddress/paymentAddress.mjs",
    },
    {
      path: ["store", "checkout", "shippingAddress"],
      module: "store/checkout/shippingAddress/shippingAddress.mjs",
    },
    {
      path: ["store", "checkout", "order"],
      module: "store/checkout/order/order.mjs",
    },
  ],
};
