import Vue from 'vue'

import { creditTiers } from '~/assets/json/pricing.json'
import userNav from '~/assets/json/nav/user.json'
import sets from '~/assets/json/sets.json'
import countries from '~/assets/json/countries.json'
import languages from '~/assets/json/languages.json'
import states from '~/assets/json/states.json'

const socialBaseUrls = {
  twitter: 'https://www.twitter.com/',
  facebook: 'https://www.facebook.com/',
  instagram: 'https://www.instagram.com/',
  github: 'https://www.github.com/',
  tiktok: 'https://www.tiktok.com/',
  youtube: 'https://www.youtube.com/',
  pinterest: 'https://www.pinterest.com/',
  linkedin: 'https://www.linkedin.com/',
  owler: 'https://www.owler.com/',
}

Vue.mixin({
  methods: {
    formatCurrency: (amount, currency = 'USD', decimal = false) =>
      `${amount.toLocaleString(
        currency.toUpperCase() === 'AUD' ? 'en-AU' : 'en-US',
        {
          style: 'currency',
          currency,
          minimumFractionDigits: decimal ? 2 : 0,
          maximumFractionDigits: decimal ? 4 : 0,
        }
      )}${
        currency.toUpperCase() === 'AUD' ? ` ${currency.toUpperCase()}` : ''
      }`,
    formatDate: (date, format) => {
      switch (format) {
        case 'monthYear':
          return date.toLocaleString(undefined, {
            month: 'long',
            year: 'numeric',
          })
        default:
          return date.toLocaleString(undefined, {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })
      }
    },
    formatNumber: (number, readable) => {
      if (typeof number !== 'number') {
        return ''
      }

      if (readable && number > 10) {
        const length = number.toString().length
        const half = Math.round(length / 2)

        number =
          number.toString().slice(0, half) +
          Array(Math.max(0, length - half + 1)).join(0)
      }

      return isNaN(parseFloat(number))
        ? ''
        : parseFloat(number).toLocaleString()
    },
    formatHostname(url) {
      try {
        const { hostname } = new URL(url)

        return hostname.replace(/^www\./, '')
      } catch (error) {
        return url.replace(/^https?:\/\/www\./, '')
      }
    },
    getErrorMessage(error) {
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
              error.response.data.message ||
              error.response.data.toString('utf-8')
            }${code}`
        }
      } else {
        return error.message || error.toString()
      }
    },
    scrollTo(selector) {
      this.$nextTick(() =>
        setTimeout(
          () =>
            document
              .querySelector(selector)
              .scrollIntoView({ behavior: 'smooth' }),
          100
        )
      )
    },
    scrollToTop() {
      this.$nextTick(() =>
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100)
      )
    },
    centsToCredits(cents) {
      if (!cents) {
        return 0
      }

      const tiers = Object.keys(creditTiers).map((tier) => parseInt(tier, 10))

      let remaining = cents

      return Math.round(
        tiers.reduce((credits, tier, index) => {
          const price = this.creditTiers[tier]

          const diff = Math.min(
            remaining,
            price * (tier - (index ? tiers[index - 1] : 0))
          )

          credits += (index === tiers.length - 1 ? remaining : diff) / price

          remaining -= diff

          return credits
        }, 0)
      )
    },
    creditsToCents(credits) {
      if (!credits) {
        return 0
      }

      const tiers = Object.keys(creditTiers).map((tier) => parseInt(tier, 10))

      let remaining = credits

      return tiers.reduce((price, tier, index) => {
        const amount = tier - (index ? tiers[index - 1] : 0)

        const credits = Math.max(
          index === tiers.length - 1
            ? remaining
            : Math.min(amount, index ? remaining : Math.max(amount, remaining)),
          0
        )

        remaining -= credits

        return price + credits * creditTiers[tier]
      }, 0)
    },
    signInAs(userId) {
      userId = userId.toLowerCase().trim()

      this.$store.commit('user/setLoading', true)
      this.$store.commit('user/setImpersonating', userId)
      this.$store.commit('user/setImpersonator', this.$store.state.user.attrs)

      return new Promise((resolve, reject) => {
        this.$nextTick(async () => {
          try {
            const user = (await this.$axios.get('user')).data

            this.$store.commit('user/setAttrs', user)
            this.$store.commit('user/setLoading', false)

            if (this.$store.state.user.attrs.admin === '1') {
              this.$store.dispatch('organisations/get')
            }

            this.$store.dispatch('credits/get')

            this.$cookies.set('impersonate', userId, {
              path: '/',
              maxAge: 60 * 60 * 24 * 7,
            })

            const navItem = userNav.find(
              ({ to }) =>
                to.replace(/\/$/, '') === this.$route.path.replace(/\/$/, '')
            )

            if (navItem && !navItem.member) {
              this.$router.push('/orders/')
            }
          } catch (error) {
            this.$store.commit('user/setImpersonating', '')
            this.$store.commit('user/setImpersonator', null)
            this.$store.commit('user/setLoading', false)

            this.$cookies.set('impersonate', '', {
              path: '/',
              maxAge: 60 * 60 * 24 * 7,
            })

            reject(new Error(this.getErrorMessage(error)))
          }

          resolve()
        })
      })
    },
    signOutAs() {
      this.$store.commit('user/setLoading', true)
      this.$store.commit('user/setImpersonating', '')
      this.$store.commit('user/setImpersonator', null)

      this.$cookies.set('impersonate', '', {
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      })

      return new Promise((resolve, reject) => {
        this.$nextTick(async () => {
          try {
            const user = (await this.$axios.get('user')).data

            this.$store.commit('user/setAttrs', user)
            this.$store.commit('user/setLoading', false)

            this.$store.dispatch('organisations/get')
            this.$store.dispatch('credits/get')
          } catch (error) {
            reject(new Error(this.getErrorMessage(error)))
          }

          resolve()
        })
      })
    },
    formatCountry(code) {
      const country = countries.find(
        ({ value }) => value.toUpperCase() === code.toUpperCase()
      )

      return country ? country.text : code
    },
    formatRegion(countryCode, regionCode) {
      if (states[countryCode.toUpperCase()]) {
        const region = states[countryCode.toUpperCase()].find(
          ({ value }) => value.toUpperCase() === regionCode.toUpperCase()
        )

        return region ? region.text : regionCode
      }

      return regionCode
    },
    formatLanguage(code) {
      for (const name in languages) {
        if (typeof languages[name] === 'string') {
          if (languages[name].toUpperCase() === code.toUpperCase()) {
            return name
          }
        } else {
          for (const variant in languages[name]) {
            if (languages[name][variant].toUpperCase() === code.toUpperCase()) {
              return name === variant ? name : `${name} (${variant})`
            }
          }
        }
      }

      return code
    },
    transformAttributes(keys, attributes) {
      const formatted = {}

      for (const set of sets.filter(
        ({ key }) => keys === 'all' || keys.includes(key)
      )) {
        formatted[set.key] = {
          title: set.name,
          attributes: {},
        }

        for (const attribute of set.attributes) {
          const title = attribute.name || attribute.key

          formatted[set.key].attributes[attribute.key] = {
            title: title.charAt(0).toUpperCase() + title.substring(1),
            values: [],
          }

          const values = attributes[attribute.key]

          if (Array.isArray(values)) {
            for (const value of values) {
              if (!value) {
                continue
              }

              switch (set.key) {
                case 'social':
                  formatted[set.key].attributes[attribute.key].values.push({
                    to: `${socialBaseUrls[attribute.key]}${value}`,
                    text: value,
                  })

                  break
                default:
                  formatted[set.key].attributes[attribute.key].values.push({
                    text: value,
                  })
              }
            }
          } else {
            const value = values

            if (!value) {
              continue
            }

            switch (attribute.key) {
              case 'language':
                formatted[set.key].attributes[attribute.key].values.push({
                  text: this.formatLanguage(value),
                })

                break
              case 'ipCountry':
                formatted[set.key].attributes[attribute.key].values.push({
                  text: this.formatCountry(value),
                })

                break
              case 'ipRegion':
                if (attributes.ipCountry) {
                  formatted[set.key].attributes[attribute.key].values.push({
                    text: this.formatRegion(attributes.ipCountry, value),
                  })
                }

                break
              default:
                formatted[set.key].attributes[attribute.key].values.push({
                  text: value,
                })
            }
          }
        }
      }

      Object.keys(formatted).forEach((key) => {
        Object.keys(formatted[key].attributes).forEach((attribute) => {
          if (!formatted[key].attributes[attribute].values.length) {
            delete formatted[key].attributes[attribute]
          }
        })

        if (!Object.keys(formatted[key].attributes).length) {
          delete formatted[key]
        }
      })

      return formatted
    },
    formatAttribute(key, value) {
      const set = sets.find((set) =>
        set.attributes.some(({ key: _key }) => key === _key)
      )

      if (!set) {
        return value
      }

      if (typeof value === 'undefined') {
        const attribute = set.attributes.find(({ key: _key }) => key === _key)

        const formatted = attribute ? attribute.name || attribute.key : key

        return formatted.charAt(0).toUpperCase() + formatted.substring(1)
      }

      if (set.key === 'social') {
        return {
          to: `${socialBaseUrls[key]}${value}`,
          text: value,
        }
      }

      switch (key) {
        case 'trafficRank':
          return this.formatNumber(parseInt(value, 10))
        case 'url':
          return {
            to: value,
            text: value,
          }
        case 'email':
          return {
            to: `mailto:${value}`,
            text: value,
          }
        case 'phone':
          return {
            to: `tel:${value}`,
            text: value,
          }
        case 'whatsapp':
          return {
            to: `whatsapp:${value}`,
            text: value,
          }
        case 'skype':
          return {
            to: `skype:${value}`,
            text: value,
          }
        case 'certInfo.validTo':
          return value
            ? this.formatDate(new Date(parseInt(value, 10) * 1000))
            : value
        default:
          return value
      }
    },
  },
})
