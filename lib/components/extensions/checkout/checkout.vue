<template>
      <vf-o-form @submit="onSubmit" v-if="!loading">
        <vf-m-row>
          <vf-m-col md="4" sm="12">
            <vf-o-payment-address
              ref="paymentAddress"
              :delivery="response.shippingAddress.length > 0"
              :address="response.paymentAddress"
              :countries="response.countriesList"
              :zones="paymentZones"
              class="mb-3"
              @updateDeliveryAddress="deliveryAddress = $event"
              @input="updatePaymentAddress"
            />
            <vf-o-shipping-address
              v-if="!deliveryAddress && response.shippingAddress.length > 0"
              ref="shippingAddress"
              :address="response.shippingAddress"
              :countries="response.countriesList"
              :zones="shippingZones"
              @input="updateShippingAddress"
            />
          </vf-m-col>
          <vf-m-col md="8" sm="12">
            <vf-m-row>
              <vf-m-col md="6" sm="12">
                <vf-o-payment-methods
                  ref="paymentMethods"
                  :methods="response.paymentMethods"
                  @input="handlePaymentMethod"
                  class="mb-3"
                />
              </vf-m-col>
              <vf-m-col md="6" sm="12">
                <vf-o-shipping-methods
                  ref="shippingMethods"
                  :methods="response.shippingMethods"
                  @input="handleShippingMethod"
                  class="mb-3"
                />
              </vf-m-col>
            </vf-m-row>
            <vf-o-checkout-cart :cart="cart" :totals="response.totals"/>
          </vf-m-col>
        </vf-m-row>
        <template #button>
          {{$t('modules.store.checkout.buttonConfirm')}}
          <vf-a-icon icon="long-arrow-alt-right" size="sm" />
        </template>
      </vf-o-form>
      <vf-a-loader v-else/>
</template>
<script>
import { validationMixin } from "vuelidate";
import {mapGetters} from 'vuex'
import {find, debounce} from 'lodash'
import required from "vuelidate/lib/validators/required";
import minLength from "vuelidate/lib/validators/minLength";
import maxLength from "vuelidate/lib/validators/maxLength";
import gql from 'graphql-tag'
export default {
  data() {
    return {
      debounced: debounce(this.updateOrder, 1000),
      response: {},
      loading: true,
      deliveryAddress: true,
      paymentMethod: '',
      shippingMethod: '',
      paymentAddress: {},
      shippingAddress: {}
    }
  },
  mixins: [validationMixin],
  mounted() {
    this.$vfapollo.mutate({
      mutation: gql`mutation{
        createOrder {
          success
        }
      }`
    }).then(() => {
      this.$store.dispatch('apollo/query', {
        query:this.$options.query
      }).then(() => {
        const response = this.$store.getters['apollo/get']
        this.$store.commit('store/cart/setCart', response.cart)
        this.response = response
        this.loading = false
      })
    })
  },

  watch: {
    cart: {
      handler(val, oldVal) {
        if(val !== oldVal) {
          this.debounced()
        }
      },
      deep: true
    }
  },
  computed: {
    ...mapGetters({
      url: 'store/checkout/order/url',
      error: 'vuefront/error',
      cart: 'store/cart/get',
      paymentZones: 'store/checkout/paymentAddress/zones',
      shippingZones: 'store/checkout/shippingAddress/zones'
    }),
    paymentAddressData() {
      let result = []

      for(const key in this.paymentAddress) {
        result = [...result, {
          name: key,
          value: this.paymentAddress[key]
        }]
      }

      return result
    },
    shippingAddressData() {
      let result = []

      if(this.deliveryAddress) {
        result = this.paymentAddressData
      } else {
        for(const key in this.shippingAddress) {
          result = [...result, {
            name: key,
            value: this.shippingAddress[key]
          }]
        }
      }

      return result
    }
  },
  methods: {
    async handlePaymentMethod(val) {
      this.paymentMethod = val
      this.debounced()
    },
    async handleShippingMethod(val) {
      this.shippingMethod = val
      this.debounced()
    },
    async updatePaymentAddress(val) {
      this.paymentAddress = val
     this.debounced()
    },
    async updateShippingAddress(val) {
      this.shippingAddress = val
      this.debounced()
    },
    async updateOrder() {
      const data = await this.$store.dispatch('store/checkout/order/update', {
        paymentAddress: this.paymentAddressData,
        shippingAddress: this.shippingAddressData,
        paymentMethod: this.paymentMethod,
        shippingMethod: this.shippingMethod
      })
      if(data) {
        this.response = {...this.response, ...data.updateOrder}
      }
    },
    async onSubmit() {
      this.$refs.paymentAddress.$v.$touch()
      this.$refs.paymentMethods.$v.$touch()
      this.$refs.shippingMethods.$v.$touch()

      if(!this.deliveryAddress) {
        this.$refs.shippingAddress.$v.$touch()
      }

      if (!this.$refs.paymentAddress.$v.form.$invalid && !this.$refs.shippingMethods.$v.method.$invalid && !this.$refs.paymentMethods.$v.method.$invalid) {
        if(this.deliveryAddress || (!this.deliveryAddress  && !this.$refs.shippingAddress.$v.form.$invalid)) {
          await this.$store.dispatch('store/checkout/order/confirm')

          if(!this.error) {
            window.location.href = this.url
          }
        }
      }
    },
    handleLoaded(response) {
      if(response.cart.products.length === 0) {
        this.$router.push('/store/cart')
      }
      this.$store.commit('store/cart/setCart', response.cart)
      this.$nextTick(() => {
        this.response = {...response}
      })
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
  totals {
    title
    text
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
