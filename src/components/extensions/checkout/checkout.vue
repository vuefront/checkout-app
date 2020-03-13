<template>
    <vf-o-apollo class="vf-e-store-checkout" v-slot="{data: response}" @loaded="handleLoaded">
      <vf-o-form @submit="onSubmit">
        <vf-m-row>
          <vf-m-col md="6" sm="12">
            <vf-o-payment-address :address="response.paymentAddress" :countries="response.countriesList" class="mb-3"/>
            <vf-o-shipping-address :address="response.shippingAddress" :countries="response.countriesList"/>
          </vf-m-col>
          <vf-m-col md="6" sm="12">
            <vf-o-cart-products :cart="cart" />
          </vf-m-col>
        </vf-m-row>
        <template #button>
          {{$t('modules.store.checkout.buttonConfirm')}}
          <vf-a-icon icon="long-arrow-alt-right" size="sm" />
        </template>
      </vf-o-form>
    </vf-o-apollo>
</template>
<script>
import { validationMixin } from "vuelidate";
import {mapGetters} from 'vuex'
export default {
  mixins: [validationMixin],
  computed: {
    ...mapGetters({
      cart: 'store/cart/get'
    })
  },
  methods: {
    async onSubmit() {

    },
    handleLoaded({cart}) {
      this.$store.commit('store/cart/setCart', cart)
    }
  }
}
</script>
<graphql>
{
  countriesList(page: 1, size: -1) {
    content {
      id
      name
    }
  }
	paymentAddress {
    type
    name
    label
    required
    values {
      text
      value
    }
  }
  shippingAddress {
    type
    name
    label
    required
    values {
      text
      value
    }
  }
  cart {
      products {
          key
          quantity
          total
          option {
              name
              value
              type
          }
          product {
              id
              name
              model
              price
              image
              imageLazy
          }
      }
      total
  }
}
</graphql>
