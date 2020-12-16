<template>
  <div>
    <v-card class="mb-4">
      <v-card-title>
        Technology lookup
      </v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid" @submit.prevent="submit">
          <v-text-field
            ref="url"
            v-model="url"
            hide-details="auto"
            label="Website URL"
            placeholder="https://www.example.com"
            :append-icon="mdiMagnify"
            :loading="submitting"
            :error-messages="error"
            :rules="urlRules"
            :hint="`You have ${parseFloat(
              credits
            ).toLocaleString()} credits remaining.`"
            @click:append="submit"
            @focus="$event.target.select()"
          />
        </v-form>
      </v-card-text>
    </v-card>

    <v-card v-for="category in categorised" :key="category.slug" class="mb-4">
      <v-card-title class="subtitle-2">
        <a
          :href="`${websiteUrl}/technologies/${category.slug}/?utm_source=lookup&utm_medium=twa&utm_campaign=wappalyzer`"
          target="_blank"
          class="black--text text-decoration-none"
        >
          {{ category.name }}
        </a>
      </v-card-title>
      <v-card-text class="px-0">
        <v-simple-table>
          <tbody>
            <tr
              v-for="{ name, slug, categories, icon } in category.technologies"
              :key="name"
            >
              <td>
                <a
                  :href="`${websiteUrl}/technologies/${
                    categories.length ? `${categories[0].slug}/` : ''
                  }${slug}/?utm_source=lookup&utm_medium=twa&utm_campaign=wappalyzer`"
                  target="_blank"
                  class="d-flex align-center body-2 my-2"
                >
                  <TechnologyIcon :base-url="websiteUrl" :icon="icon" />
                  {{ name }}
                </a>
              </td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-card-text>
    </v-card>

    <v-card v-if="!credits">
      <v-card-title class="subtitle-2">
        No credits remaining
      </v-card-title>
      <v-card-text class="pb-0">
        Please top-up your credit balance.
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          :href="`${websiteUrl}/credits/`"
          color="accent"
          target="_blank"
          text
          >Buy credits</v-btn
        >
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { mdiMagnify } from '@mdi/js'

import TechnologyIcon from '~/components/TechnologyIcon.vue'

function getErrorMessage(error) {
  if (error.response) {
    const code = error.response.data.code
      ? ` (reference ${error.response.data.code})`
      : ''

    switch (error.response.status) {
      case 401:
        return `You must be signed into access this item${code}`
      case 403:
        return `You don't have access this item${code}`
      case 404:
        return `Item not found${code}`
      case 409:
        return `Too many requests, please try again later${code}`
      default:
        return `${
          error.response.data.message || error.response.data.toString('utf-8')
        }${code}`
    }
  } else {
    return error.message || error.toString()
  }
}

function getFullUrl(url = '') {
  let fullUrl = url.trim()

  if (!/[^.]\.[a-z]{2,}$/i.test(url)) {
    return ''
  }

  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    fullUrl = `http://${fullUrl}`
  }

  try {
    new URL(fullUrl) // eslint-disable-line no-new
  } catch (error) {
    return ''
  }

  return fullUrl
}

export default {
  components: {
    TechnologyIcon,
  },
  data() {
    return {
      url: '',
      error: null,
      mdiMagnify,
      urlRules: [(v) => !!getFullUrl(v) || 'Please enter a valid URL'],
      submitting: false,
      technologies: [],
      valid: false,
      websiteUrl: process.env.WEBSITE_URL,
    }
  },
  computed: {
    ...mapState({
      isSignedIn: ({ user }) => user.isSignedIn,
      credits: ({ credits: { credits } }) => credits,
    }),
    categorised() {
      return Object.values(
        this.technologies.reduce((categories, technology) => {
          technology.categories.forEach((category) => {
            categories[category.slug] = categories[category.slug] || {
              ...category,
              technologies: [],
            }

            categories[category.slug].technologies.push(technology)
          })

          return categories
        }, {})
      )
    },
  },
  watch: {
    async isSignedIn() {
      if (this.isSignedIn) {
        this.$refs.url.focus()

        if (this.url) {
          this.lastUrl = null

          await this.submit()
        }
      }
    },
  },
  mounted() {
    const { url, title, text } = this.$route.query

    const textMatch = (text || '').match(/http[^\s]+/) || []
    const titleMatch = (title || '').match(/http[^\s]+/) || []

    this.url = url || textMatch[0] || titleMatch[0] || this.url

    if (this.$refs.url) {
      this.$refs.url.focus()
    }

    if (this.url) {
      this.submit()
    }
  },
  methods: {
    async submit() {
      this.error = null
      this.technologies = []

      this.url = getFullUrl(this.url)

      if (!this.$refs.form.validate()) {
        return
      }

      this.submitting = true

      this.$refs.url.blur()

      let credits

      try {
        ;({
          credits,
          technologies: this.technologies,
          attributes: this.attributes,
        } = (
          await this.$axios(`lookup-site/${encodeURIComponent(this.url)}`)
        ).data)

        this.$store.commit('credits/set', credits)
      } catch (error) {
        this.error =
          (error.response &&
            error.response.data &&
            (error.response.data.message ||
              error.response.data.toString('utf-8'))) ||
          getErrorMessage(error)
      }

      this.submitting = false
    },
  },
}
</script>
