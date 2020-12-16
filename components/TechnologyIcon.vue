<template>
  <v-avatar color="secondary elevation-1 mr-2" :size="large ? 40 : 32">
    <div class="d-flex">
      <v-img
        :src="`${baseUrl}/images/icons/${icon}`"
        :alt="`Websites using ${icon.replace(/\.[a-z]+$/i, '')}`"
        class="d-inline-block"
        contain
        :height="large ? 24 : 16"
        :width="large ? 24 : 16"
      />
    </div>
  </v-avatar>
</template>

<script>
export default {
  props: {
    baseUrl: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: '',
    },
    large: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
