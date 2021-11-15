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
      <vf-m-product-quantity
        :quantity="product.quantity"
        size="sm"
        @change="handleChangeQuantity"
      />
    </div>

    <div class="vf-o-checkout-cart-product__actions">
      <div class="vf-o-checkout-cart-product__remove" @click="handleRemove">
        <vf-a-icon :icon="mdiTrashCanOutline" :size="16" />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, inject } from "vue";
import { useStore } from "vuex";
import { mdiTrashCanOutline } from "@mdi/js";
const vuefront$ = inject<any>("$vuefront");
const props = defineProps({
  product: {
    type: Object,
    default() {
      return null;
    },
  },
});

const image = computed(() =>
  props.product.product.image !== ""
    ? props.product.product.image
    : vuefront$.images.placeholder.image
);

const imageLazy = computed(() =>
  props.product.product.imageLazy !== ""
    ? props.product.product.imageLazy
    : vuefront$.images.placeholder.image
);

const store = useStore();

const handleChangeQuantity = (e: number) => {
  store.dispatch("store/cart/update", {
    key: props.product.key,
    quantity: Number(e),
  });
};

const handleRemove = () => {
  store.dispatch("store/cart/remove", {
    key: props.product.key,
  });
};
</script>
