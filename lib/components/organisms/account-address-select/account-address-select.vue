<template>
  <div>
    select
  </div>
</template>
<script>
export default {
  fragments:{
    fields:  `
      {
        accountAddressList {
          id
          firstName
          lastName
          address1
        }
      }`
  },
}
</script>
