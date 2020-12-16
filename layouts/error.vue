<template>
  <v-alert v-if="statusCode !== 404" type="error" class="mt-4" outlined>
    {{ message }}

    <template v-if="code">
      <br /><br />
      Reference: {{ code }}
    </template>
  </v-alert>
</template>

<script>
export default {
  layout: 'empty',
  props: {
    error: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      statusCode: this.error.response
        ? this.error.response.status
        : this.error.statusCode,
      message: this.error.response
        ? this.error.response.data.message || this.error.response.data
        : this.error.message || this.error.toString(),
      code: (this.error.response && this.error.response.code) || '',
    }
  },
  computed: {
    title() {
      return this.statusCode >= 500
        ? 'Server error'
        : this.statusCode === 404
        ? 'Not found'
        : this.statusCode >= 400
        ? 'Request error'
        : 'Something went wrong'
    },
    subtitle() {
      return this.statusCode === 404
        ? ''
        : `${this.statusCode} ${
            this.statusCode === 500
              ? 'Internal server error'
              : this.statusCode === 502
              ? 'Bad gateway'
              : this.statusCode === 503
              ? 'Unavailable'
              : this.statusCode === 400
              ? 'Bad request'
              : this.statusCode === 401
              ? 'Unauthorised'
              : this.statusCode === 403
              ? 'Forbidden'
              : this.statusCode === 409
              ? 'Too many requests'
              : ''
          }`
    },
    text() {
      return this.statusCode === 404
        ? `This page you're looking for isn't here.`
        : `Sorry, something went wrong. Try reloading the page or <a href='/contact'>contact us</a> if the issue persists.`
    },
  },
}
</script>
