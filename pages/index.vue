<template>
  <div>
    <v-card class="my-4" tile>
      <v-card-title>
        <div class="d-flex align-center">
          <v-icon color="primary" left>{{ mdiLayersOutline }}</v-icon>
          Lookup
        </div>
      </v-card-title>
      <v-card-text>
        <v-form
          ref="form"
          v-model="valid"
          :disabled="isLoading"
          @submit.prevent="submit"
        >
          <p class="mb-6">
            Enter a website URL to reveal the technology stack, metadata and
            company and contact details.
          </p>

          <v-text-field
            ref="url"
            v-model="url"
            hide-details="auto"
            label="Enter a website URL"
            placeholder="https://www.example.com"
            type="url"
            outlined
            :append-icon="mdiMagnify"
            :rules="urlRules"
            :hint="
              !isLoading && isSignedIn
                ? `You have ${parseFloat(
                    credits || 0
                  ).toLocaleString()} credits remaining.`
                : ''
            "
            @click:append="submit"
            @focus="$event.target.select()"
          />
        </v-form>

        <v-alert v-if="error" color="info" class="mt-4 mb-0" outlined>
          {{ error }}
        </v-alert>
      </v-card-text>
    </v-card>

    <v-card v-if="loading" class="my-4" tile>
      <v-card-text class="d-flex justify-center">
        <Progress />
      </v-card-text>
    </v-card>

    <div
      v-if="(!loading || !url) && !technologies.length"
      class="d-flex justify-center pa-4"
    >
      <v-img
        src="/images/lookup.png"
        width="100%"
        style="max-width: 400px"
        class="mx-auto d-block"
        contain
      />
    </div>

    <v-expansion-panels
      v-if="
        !loading &&
        !error &&
        (Object.keys(attributes).length || keywords.length)
      "
      class="mt-4"
    >
      <Attributes
        v-if="Object.keys(attributes).length"
        :hostname="attributes"
        :masked-sets="maskedSets"
        @signIn="signInDialog = true"
      />

      <v-expansion-panel v-if="keywords && keywords.length" flat>
        <v-expansion-panel-header class="subtitle-2" style="line-height: 1em">
          Keywords
        </v-expansion-panel-header>
        <v-expansion-panel-content eager>
          <v-chip-group column>
            <v-chip
              v-for="keyword in keywords"
              :key="keyword"
              :href="`${websiteUrl}/websites/${keyword}/`"
              color="accent--text"
              outlined
              label
            >
              {{ keyword }}
            </v-chip>
          </v-chip-group>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>

    <v-card
      v-if="!loading && !error && technologies.length"
      class="my-4"
      style="overflow: hidden"
      tile
    >
      <v-card-title class="subtitle-2">Technologies</v-card-title>
      <div v-for="category in categorised" :key="category.slug" class="mb-4">
        <v-divider />

        <v-card-title class="subtitle-2">
          {{ category.name }}
        </v-card-title>
        <v-card-text class="pa-0">
          <v-simple-table>
            <tbody>
              <tr
                v-for="{ name, slug, icon } in category.technologies"
                :key="name"
              >
                <td>
                  <a
                    :href="`${websiteUrl}/technologies/${category.slug}/${slug}/?utm_source=lookup&utm_medium=twa&utm_campaign=wappalyzer`"
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
      </div>
    </v-card>

    <v-card v-if="isSignedIn && !isLoading && !credits" tile>
      <v-card-title class="subtitle-2">No credits remaining</v-card-title>
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

    <v-dialog
      v-if="!isLoading && !isSignedIn"
      v-model="signInDialog"
      max-width="400px"
    >
      <SignIn mode-sign-up mode-continue />
    </v-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { mdiMagnify, mdiLayersOutline } from '@mdi/js'

import TechnologyIcon from '~/components/TechnologyIcon.vue'
import Attributes from '~/components/Attributes.vue'
import Progress from '~/components/Progress.vue'
import SignIn from '~/components/SignIn.vue'

function getFullUrl(url = '') {
  let fullUrl = url.trim()

  try {
    if (!/[^.]\.[a-z]{2,}/i.test(url)) {
      throw new Error('Invalid URL')
    }

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      fullUrl = `http://${fullUrl}`
    }

    const { hostname } = new URL(fullUrl) // eslint-disable-line no-new

    if (/^(?:[\d.]+|(?:[a-f0-9:]+:+)+[a-f0-9]+|localhost)$/.test(hostname)) {
      throw new Error('Invalid URL')
    }
  } catch (error) {
    return ''
  }

  return fullUrl
}

export default {
  components: {
    TechnologyIcon,
    Attributes,
    SignIn,
    Progress,
  },
  data() {
    return {
      url: '',
      error: null,
      mdiMagnify,
      mdiLayersOutline,
      urlRules: [(v) => !v || !!getFullUrl(v) || 'Please enter a valid URL'],
      loading: false,
      attributes: {},
      technologies: [],
      keywords: [],
      maskedSets: [],
      valid: false,
      websiteUrl: this.$config.WEBSITE_URL,
      signInDialog: false,
    }
  },
  computed: {
    ...mapState({
      isLoading: ({ user, credits }) => user.loading || credits.loading,
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
    async isLoading() {
      if (!this.isLoading) {
        const { url, title, text } = this.$route.query

        const textMatch = (text || '').match(/http[^\s]+/) || []
        const titleMatch = (title || '').match(/http[^\s]+/) || []

        this.url = url || textMatch[0] || titleMatch[0] || this.url

        if (this.$refs.url) {
          this.$refs.url.focus()
        }

        if (this.url) {
          this.lastUrl = null

          await this.submit()
        }
      }
    },
  },
  methods: {
    async submit() {
      const url = getFullUrl(this.url)

      if (!url || (url === this.lastUrl && this.technologies.length)) {
        return
      }

      this.url = url

      const { hostname } = new URL(url) // eslint-disable-line no-new

      if (
        [
          'wappalyzer',
          'google',
          'facebook',
          'twitter',
          'reddit',
          'yahoo',
          'wikipedia',
          'amazon',
          'youtube',
        ].some((ignore) => hostname.includes(ignore))
      ) {
        this.error =
          'This website is excluded from lookups for technical reasons. Please use our free browser extension instead.'

        return
      }

      this.lastUrl = url

      this.error = false

      if (this.isSignedIn && !this.credits) {
        this.error = 'Insufficient credits.'

        return
      }

      this.technologies = []
      this.attributes = {}
      this.keywords = []

      this.loading = true

      let credits

      try {
        if (this.isSignedIn) {
          ;({
            maskedSets: this.maskedSets,
            credits,
            technologies: this.technologies,
            attributes: this.attributes,
            keywords: this.keywords,
          } = (
            await this.$axios(`lookup-site/${encodeURIComponent(url)}`)
          ).data)

          this.$store.commit('credits/setCredits', credits)
        } else {
          try {
            ;({
              maskedSets: this.maskedSets,
              technologies: this.technologies,
              attributes: this.attributes,
              keywords: this.keywords,
            } = (
              await this.$axios(`lookup-site/public/${encodeURIComponent(url)}`)
            ).data)
          } catch (error) {
            if (error.response && error.response.status === 401) {
              this.signInDialog = true
              this.loading = false

              return
            }

            throw error
          }
        }
      } catch (error) {
        this.error =
          (error.response &&
            error.response.data &&
            (error.response.data.message || error.response.data)) ||
          this.getErrorMessage(error)
      }

      this.technologies = this.technologies || []
      this.attributes = this.attributes || {}
      this.keywords = this.keywords || []

      this.loading = false
    },
  },
}
</script>
