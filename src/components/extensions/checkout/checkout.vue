<template>
    <vf-o-apollo class="vf-e-store-checkout" v-slot="{data: response}" @loaded="handleLoaded">
      <vf-o-form @submit="onSubmit">
        <vf-m-row>
          <vf-m-col md="5" sm="12">
            <vf-o-payment-address ref="paymentAddress" :address="response.paymentAddress" :countries="response.countriesList" :zones="paymentZones" class="mb-3" @updateDeliveryAddress="deliveryAddress = $event"/>
            <vf-o-shipping-address v-if="!deliveryAddress" ref="shippingAddress" :address="response.shippingAddress" :countries="response.countriesList" :zones="shippingZones"/>
          </vf-m-col>
          <vf-m-col md="7" sm="12">
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
import {find} from 'lodash'
import required from "vuelidate/lib/validators/required";
import minLength from "vuelidate/lib/validators/minLength";
import maxLength from "vuelidate/lib/validators/maxLength";
export default {
  data() {
    return {
      deliveryAddress: true
    }
  },
  mixins: [validationMixin],
  computed: {
    ...mapGetters({
      cart: 'store/cart/get',
      paymentZones: 'store/checkout/paymentAddress/zones',
      shippingZones: 'store/checkout/shippingAddress/zones'
    })
  },
  methods: {
    async onSubmit() {
      this.$refs.paymentAddress.$v.$touch()
      if(!this.deliveryAddress) {
        this.$refs.shippingAddress.$v.$touch()
      }
      if (!this.$refs.paymentAddress.$v.form.$invalid && (!this.deliveryAddress && !this.$refs.shippingAddress.$v.form.$invalid) ) {
        console.log('valid')
      } else {
        console.log('invalid')
      }
    },
    handleLoaded({cart, paymentAddress, shippingAddress}) {
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
