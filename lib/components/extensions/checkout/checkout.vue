<template>
    <vf-o-apollo class="vf-e-store-checkout" v-slot="{data: response}" @loaded="handleLoaded">
      <vf-o-form @submit="onSubmit">
        <vf-m-row>
          <vf-m-col md="5" sm="12">
            <vf-o-payment-address ref="paymentAddress" :delivery="response.shippingAddress.length > 0" :address="response.paymentAddress" :countries="response.countriesList" :zones="paymentZones" class="mb-3" @updateDeliveryAddress="deliveryAddress = $event"/>
            <vf-o-shipping-address v-if="!deliveryAddress && response.shippingAddress.length > 0" ref="shippingAddress" :address="response.shippingAddress" :countries="response.countriesList" :zones="shippingZones"/>
          </vf-m-col>
          <vf-m-col md="7" sm="12">
            <vf-o-payment-methods ref="paymentMethods" :methods="response.paymentMethods" @input="paymentMethod = $event" class="mb-3"/>
            <vf-o-shipping-methods ref="shippingMethods" :methods="response.shippingMethods" @input="shippingMethod = $event" class="mb-3"/>
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
      deliveryAddress: true,
      paymentMethod: '',
      shippingMethod: ''
    }
  },
  mixins: [validationMixin],
  computed: {
    ...mapGetters({
      url: 'store/checkout/order/url',
      error: 'vuefront/error',
      cart: 'store/cart/get',
      paymentZones: 'store/checkout/paymentAddress/zones',
      shippingZones: 'store/checkout/shippingAddress/zones'
    })
  },
  methods: {
    async onSubmit() {
      this.$refs.paymentAddress.$v.$touch()
      this.$refs.paymentMethods.$v.$touch()
      this.$refs.shippingMethods.$v.$touch()

      if(!this.deliveryAddress) {
        this.$refs.shippingAddress.$v.$touch()
      }

      if (!this.$refs.paymentAddress.$v.form.$invalid) {
        if(this.deliveryAddress || (!this.deliveryAddress  && !this.$refs.shippingAddress.$v.form.$invalid)) {
          let paymentAddress = []
          let shippingAddress = []

          for(const key in this.$refs.paymentAddress._data.form) {
            paymentAddress = [...paymentAddress, {
              name: key,
              value: this.$refs.paymentAddress._data.form[key]
            }]
          }

          if(this.deliveryAddress) {
            shippingAddress = paymentAddress
          } else {
            for(const key in this.$refs.shippingAddress._data.form) {
              shippingAddress = [...shippingAddress, {
                name: key,
                value: this.$refs.shippingAddress._data.form[key]
              }]
            }
          }

          await this.$store.dispatch('store/checkout/order/create', {
            paymentAddress,
            shippingAddress,
            paymentMethod: this.paymentMethod,
            shippingMethod: this.shippingMethod
          })

          if(!this.error) {
            // window.location.href = this.url
          }
        }
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
  paymentMethods {
    id
    codename
    name
  }
  shippingMethods {
    id
    codename
    name
  }
	paymentAddress {
    agree
    fields {
      type
      name
      label
      required
      values {
        text
        value
      }
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
