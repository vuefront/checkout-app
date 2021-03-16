<template>
  <vf-m-card
    class="vf-e-store-checkout__cart"
    :title="$t('modules.store.checkout.cartTitle')"
  >
    <div
      v-for="item in cart.products"
      :key="item.key"
      class="vf-e-store-checkout__cart__products"
    >
      <div class="vf-e-store-checkout__cart__products_thumb">
        <vf-m-product-thumb-inline
          :product="item.product"
          :option="item.option"
        />
      </div>
      <div class="vf-e-store-checkout__cart__products_quantity">
        <vf-o-cart-quantity :cart-product="item" />
      </div>
      <div class="vf-e-store-checkout__cart__products_price">
        {{ item.total }}
      </div>
      <div class="vf-e-store-checkout__cart__products_actions">
        <vf-o-cart-actions :cart-product="item" />
      </div>
    </div>
    <div class="vf-e-store-checkout__cart__totals">
      <vf-m-row
        v-for="(value, key) in totals"
        :key="key"
        class="vf-e-store-checkout__cart__total"
      >
        <vf-m-col sm="9" md="6" class="text-right">
          {{ value.title }}
        </vf-m-col>
        <vf-m-col sm="3" md="6" class="text-right">
          {{ value.text }}
        </vf-m-col>
      </vf-m-row>
    </div>
  </vf-m-card>
</template>
<script>
export default {
  props: ["cart", "totals"],
  data() {
    return {
      fields: [
        {
          key: "product",
          sortable: false,
        },
        {
          key: "price",
          sortable: false,
        },
        {
          key: "quantity",
          sortable: false,
        },
        {
          key: "total",
          sortable: false,
        },
        {
          key: "action",
          sortable: false,
        },
      ],
    };
  },
};
</script>
