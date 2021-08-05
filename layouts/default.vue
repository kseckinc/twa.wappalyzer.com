<template>
  <v-app light>
    <v-main>
      <v-sheet color="secondary" class="d-flex flex-column" height="100%">
        <v-app-bar color="primary" class="flex-grow-0" height="80" dark flat>
          <LogoDark height="40" width="160" />

          <v-spacer />

          <v-menu offset-y>
            <template #activator="{ on }">
              <v-btn icon v-on="on">
                <v-icon>{{ mdiDotsVertical }}</v-icon>
              </v-btn>
            </template>

            <v-sheet color="white">
              <template v-if="isSignedIn">
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title class="mb-2"
                      >Signed in as</v-list-item-title
                    >

                    <span>
                      <small>{{
                        user.billingName || user.name || user.email
                      }}</small>

                      <v-chip
                        v-if="isPro"
                        color="primary"
                        class="ml-1"
                        outlined
                        x-small
                        >PRO</v-chip
                      >
                    </span>
                  </v-list-item-content>
                </v-list-item>

                <v-divider />

                <v-list-item nav dense>
                  <v-list-item-title
                    class="font-weight-regular d-flex justify-space-between"
                  >
                    <span>Credit balance:</span
                    ><span>{{
                      parseFloat(credits || 0).toLocaleString()
                    }}</span>
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
                    v-if="isSignedIn"
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
                  <template v-else>
                    <v-list-item @click="signUpDialog = true">
                      <v-list-item-icon>
                        <v-icon>{{ mdiAccountPlus }}</v-icon>
                      </v-list-item-icon>
                      <v-list-item-title>Sign up free</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="signInDialog = true">
                      <v-list-item-icon>
                        <v-icon>{{ mdiAccount }}</v-icon>
                      </v-list-item-icon>
                      <v-list-item-title>Sign in</v-list-item-title>
                    </v-list-item>
                  </template>

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

        <v-container class="pa-0">
          <nuxt />
        </v-container>
      </v-sheet>
    </v-main>

    <v-dialog
      v-if="!isLoading && !isSignedIn"
      v-model="signUpDialog"
      max-width="400px"
    >
      <SignIn mode-sign-up />
    </v-dialog>

    <v-dialog
      v-if="!isLoading && !isSignedIn"
      v-model="signInDialog"
      max-width="400px"
    >
      <SignIn />
    </v-dialog>
  </v-app>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import {
  mdiHome,
  mdiAccount,
  mdiAccountPlus,
  mdiOpenInNew,
  mdiLogoutVariant,
  mdiDotsVertical,
} from '@mdi/js'

import LogoDark from '~/assets/images/logo/dark.svg?inline'
import SignIn from '~/components/SignIn.vue'

export default {
  components: {
    LogoDark,
    SignIn,
  },
  data() {
    return {
      drawer: false,
      mdiHome,
      mdiAccount,
      mdiAccountPlus,
      mdiOpenInNew,
      mdiLogoutVariant,
      mdiDotsVertical,
      websiteUrl: this.$config.WEBSITE_URL,
      signInDialog: false,
      signUpDialog: false,
    }
  },
  computed: {
    ...mapState({
      user: ({ user }) => user.attrs,
      isLoading: ({ user, credits }) => user.loading || credits.loading,
      isSignedIn: ({ user }) => user.isSignedIn,
      isPro: ({ credits }) => credits.pro,
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
      } else {
        this.resetCredits()
      }
    },
    isLoading() {
      if (!this.isSignedIn) {
        this.resetCredits()
      }
    },
  },
  mounted() {
    this.updateUserAttrs()
  },
  methods: {
    ...mapActions({
      updateUserAttrs: 'user/updateAttrs',
      getCredits: 'credits/get',
      resetCredits: 'credits/reset',
      signOut: 'user/signOut',
    }),
  },
}
</script>
