<template>
  <div v-show="$vuefront.isAuth" class="vf-o-account-address-select">
    <vf-o-apollo @loaded="handleLoaded">
      <vf-a-radio-group
        :options="options"
        stacked
        @input="handleInput"
      ></vf-a-radio-group>
    </vf-o-apollo>
  </div>
</template>
<script lang="ts" setup>
import { computed, defineProps, reactive } from "vue";
import { useI18n } from "vue-i18n";
import { useStore } from "vuex";

const i18n = useI18n();
const store = useStore();
const props = defineProps({
  value: {
    type: String,
    default() {
      return null;
    },
  },
});
const emits = defineEmits(["input"]);
let addressList = reactive([]);
const options = computed(() => {
  let result = [];
  for (const key in addressList) {
    const value = addressList[key];
    result = [
      ...result,
      {
        value: value.id,
        text: `${value.firstName} ${value.lastName} ${value.address1}`,
      },
    ];
  }

  result = [
    ...result,
    {
      text: i18n.t("modules.store.checkout.text_new_address"),
      value: null,
    },
  ];

  return result;
});
const handleLoaded = (data: { accountAddressList: any[] }) => {
  addressList = data.accountAddressList;
};
const handleInput = (value) => {
  emits("input", value);
};
</script>
<graphql>
{
	accountAddressList {
    id
    firstName
    lastName
    address1
    address2
  }
}
</graphql>
