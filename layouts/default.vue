<template>
  <v-app light>
    <v-main>
      <v-sheet color="secondary" class="d-flex flex-column" height="100%">
        <v-app-bar color="primary" class="flex-grow-0" height="80" dark>
          <LogoDark height="40" width="160" />

          <v-spacer />

          <v-menu offset-y>
            <template v-slot:activator="{ on }">
              <v-btn icon v-on="on">
                <v-icon>{{ mdiDotsVertical }}</v-icon>
              </v-btn>
            </template>

            <v-sheet color="white">
              <template v-if="isSignedIn">
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title> Signed in as: </v-list-item-title>
                    <v-list-item-subtitle>
                      {{ user.email }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>

                <v-divider />

                <v-list-item nav dense>
                  <v-list-item-title class="font-weight-regular">
                    Credits: {{ parseFloat(credits || 0).toLocaleString() }}
                  </v-list-item-title>
                </v-list-item>

                <v-divider />
              </template>

              <v-list nav dense>
                <v-list-item-group>
                  <v-list-item
                    :href="`${websiteUrl}?utm_source=sidenav&utm_medium=twa&utm_campaign=wappalyzer`"
                    target="_blank"
                  >
                    <v-list-item-icon>
                      <v-icon>{{ mdiHome }}</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title
                      >Visit website
                      <v-icon right small>{{
                        mdiOpenInNew
                      }}</v-icon></v-list-item-title
                    >
                  </v-list-item>

                  <v-list-item
                    :href="`${websiteUrl}/account/?utm_source=sidenav&utm_medium=twa&utm_campaign=wappalyzer`"
                    target="_blank"
                  >
                    <v-list-item-icon>
                      <v-icon>{{ mdiAccount }}</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>
                      Account
                      <v-icon right small>{{ mdiOpenInNew }}</v-icon>
                    </v-list-item-title>
                  </v-list-item>

                  <v-list-item v-if="isSignedIn" @click="signOut">
                    <v-list-item-icon>
                      <v-icon>{{ mdiLogoutVariant }}</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title> Sign out </v-list-item-title>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-sheet>
          </v-menu>
        </v-app-bar>

        <div
          v-if="loading"
          class="d-flex flex-grow-1 align-center justify-center"
        >
          <Progress />
        </div>
        <div v-else-if="!isSignedIn" class="d-flex flex-grow-1 align-center">
          <v-container>
            <SignIn class="flex-grow-1" mode-sign-up no-banner fluid />
          </v-container>
        </div>
        <div v-else>
          <v-container class="pb-0">
            <nuxt />
          </v-container>
        </div>
      </v-sheet>
    </v-main>
  </v-app>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import {
  mdiHome,
  mdiAccount,
  mdiOpenInNew,
  mdiLogoutVariant,
  mdiDotsVertical,
} from '@mdi/js'

import LogoDark from '~/assets/images/logo/dark.svg?inline'
import SignIn from '~/components/SignIn.vue'
import Progress from '~/components/Progress.vue'

export default {
  components: {
    LogoDark,
    SignIn,
    Progress,
  },
  data() {
    console.log(this.$config)
    return {
      loading: true,
      drawer: false,
      mdiHome,
      mdiAccount,
      mdiOpenInNew,
      mdiLogoutVariant,
      mdiDotsVertical,
      websiteUrl: this.$config.WEBSITE_URL,
    }
  },
  computed: {
    ...mapState({
      user: ({ user }) => user.attrs,
      isSignedIn: ({ user }) => user.isSignedIn,
      credits: ({ credits: { credits } }) => credits,
    }),
  },
  watch: {
    async isSignedIn() {
      if (this.isSignedIn) {
        await this.getCredits()

        this.$gtm.push({ event: 'signIn', userId: this.user.sub })

        this.$cookies.set('userId', this.user.sub, {
          path: '/',
          maxAge: 60 * 60 * 24 * 30,
        })
      }
    },
  },
  async mounted() {
    if (!this.isSignedIn) {
      await this.updateUserAttrs()
    }

    if (this.isSignedIn) {
      await this.getCredits()
    }

    this.loading = false
  },
  methods: {
    ...mapActions({
      updateUserAttrs: 'user/updateAttrs',
      getCredits: 'credits/get',
      signOut: 'user/signOut',
    }),
  },
}
</script>
