<template>
  <div v-show="$vuefront.isAuth" class="vf-o-account-address-select">
    <vf-o-apollo @loaded="handleLoaded">
      <vf-a-radio-group
        :options="options"
        stacked
        @update:modelValue="handleInput"
      ></vf-a-radio-group>
    </vf-o-apollo>
  </div>
</template>
<script lang="ts" setup>
import { computed, reactive, PropType } from "vue";
import { useI18n } from "vue-i18n";
import { AccountAddress } from "vuefront-api";
const i18n = useI18n();
defineProps({
  value: {
    type: Object as PropType<AccountAddress>,
    default() {
      return null;
    },
  },
});
const emits = defineEmits(["input"]);
let addressList = reactive<AccountAddress[]>([]);
const options = computed<{ value: string | null; text: string }[]>(() => {
  let result: { value: string | null; text: string }[] = [];
  for (const key in addressList) {
    const value = addressList[key];
    if (value.id) {
      result = [
        ...result,
        {
          value: value.id,
          text: `${value.firstName} ${value.lastName} ${value.address1}`,
        },
      ];
    }
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
const handleLoaded = (data: { accountAddressList: AccountAddress[] }) => {
  addressList = data.accountAddressList;
};
const handleInput = (value: any) => {
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
