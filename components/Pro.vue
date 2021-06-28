<template>
  <v-sheet
    v-if="!isPro"
    :class="`${small ? 'py-4' : 'py-6'} text-center`"
    color="primary lighten-1"
    outlined
  >
    <v-btn
      :href="`${websiteUrl}/pro/`"
      color="primary"
      target="_blank"
      depressed
      :small="small"
    >
      <v-icon left>{{ mdiLockOpenVariantOutline }}</v-icon>
      Unlock pro features</v-btn
    >
  </v-sheet>
</template>

<script>
import { mapState } from 'vuex'
import { mdiLockOpenVariantOutline } from '@mdi/js'

export default {
  props: {
    small: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return { mdiLockOpenVariantOutline, websiteUrl: this.$config.WEBSITE_URL }
  },
  computed: {
    ...mapState({
      isPro: ({ credits }) => credits.pro,
    }),
  },
}
</script>
