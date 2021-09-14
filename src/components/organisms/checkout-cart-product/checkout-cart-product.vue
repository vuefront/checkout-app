<template>
  <div class="vf-o-checkout-cart-product">
    <vf-m-media no-body class="vf-m-product-thumb-inline">
      <vf-m-media-aside
        vertical-align="center"
        class="vf-m-product-thumb-inline__image"
      >
        <vf-a-image
          :lazy-src="imageLazy"
          :src="image"
          width-amp="135"
          height-amp="90"
          width="135"
        />
      </vf-m-media-aside>
      <vf-m-media-body class="vf-m-product-thumb-inline__content">
        <div class="vf-m-product-thumb-inline__name">
          <span>{{ product.product.name }}</span>
        </div>
        <div class="vf-o-checkout-cart-product__price">
          {{ product.total }}
        </div>
        <span class="vf-m-product-thumb-inline__model">{{
          product.product.model
        }}</span>
        <span
          v-for="(value, index) in product.option"
          :key="index"
          class="vf-m-product-thumb-inline__option"
        >
          <div>
            <span v-html="value.name"></span>:
            <span v-html="value.value"></span>
          </div>
        </span>
      </vf-m-media-body>
    </vf-m-media>
    <div class="vf-o-checkout-cart-product__quantity">
      <vf-o-cart-quantity :cart-product="product" />
    </div>

    <div class="vf-o-checkout-cart-product__actions">
      <vf-o-cart-actions :cart-product="product" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import placeholder from "vuefront/assets/img/placeholder.png";
import { computed, defineProps } from "vue";
const props = defineProps({
  product: {
    type: Object,
    default() {
      return null;
    },
  },
});

const image = computed(() =>
  props.product.product.image !== "" ? props.product.product.image : placeholder
);

const imageLazy = computed(() =>
  props.product.product.imageLazy !== ""
    ? props.product.product.imageLazy
    : placeholder
);
</script>
