<template>
  <v-card class="mx-auto" :width="fluid ? '' : '400'">
    <v-card-title v-if="mode === 'signIn' || mode === 'verifySignIn'">
      Sign in {{ modeContinue ? 'to continue' : '' }}
    </v-card-title>
    <v-card-title v-else-if="mode === 'signUp' || mode === 'verifySignUp'">
      Sign up {{ modeContinue ? 'to continue' : '' }}
    </v-card-title>
    <v-card-title v-else-if="mode === 'reset' || mode === 'verifyReset'">
      Reset password
    </v-card-title>
    <v-card-title v-else-if="mode === 'confirm'">
      Re-enter your password
    </v-card-title>

    <v-card-text
      v-if="!isSignedIn || mode === 'confirm'"
      :class="mode === 'confirm' ? 'pb-0' : ''"
    >
      <v-alert
        v-if="!noBanner && mode === 'signUp'"
        color="primary lighten-1"
        class="mx-n6 px-6 mb-6 primary--text"
      >
        Sign up for free to receive 50 credits every month to spend on any
        product.
      </v-alert>

      <v-alert v-if="success" type="success" text>
        {{ success }}
      </v-alert>

      <v-alert v-if="error" type="error" text>
        {{ error }}
      </v-alert>

      <p v-if="mode === 'signIn'">
        Welcome back! Please sign in with your email address and password.
      </p>

      <v-form ref="form" v-model="valid">
        <v-text-field
          v-if="
            mode !== 'verifySignUp' &&
            mode !== 'verifySignIn' &&
            mode !== 'confirm'
          "
          v-model="email"
          :rules="emailRules"
          label="Email address"
          class="mb-4"
          hide-details="auto"
          required
          outlined
        />

        <v-text-field
          v-if="
            mode !== 'reset' &&
            mode !== 'verifySignUp' &&
            mode !== 'verifySignIn'
          "
          v-model="password"
          :rules="passwordRules"
          :append-icon="showPassword ? mdiEyeOff : mdiEye"
          :type="showPassword ? 'text' : 'password'"
          :label="mode === 'verifyReset' ? 'New password' : 'Password'"
          :class="mode === 'confirm' ? 'mt-2 mb-4' : 'mb-4'"
          hide-details="auto"
          required
          outlined
          @click:append="() => (showPassword = !showPassword)"
        />

        <v-checkbox
          v-if="mode === 'signUp'"
          v-model="subscribe"
          label="Receive occasional product updates"
          class="mt-0 pt-0 mb-4"
          hide-details
        />

        <v-alert
          v-if="mode === 'signUp'"
          color="secondary"
          class="mx-n6 px-6 mb-4"
        >
          <recaptcha v-if="mode === 'signUp'" />
        </v-alert>

        <v-text-field
          v-if="
            mode === 'verifyReset' ||
            mode === 'verifySignUp' ||
            mode === 'verifySignIn'
          "
          v-model="code"
          :rules="codeRules"
          label="Verification code"
          class="mb-4"
          hide-details="auto"
          required
          outlined
        />

        <template v-if="mode === 'signUp'">
          <v-btn
            :disabled="!valid"
            :loading="signingUp"
            type="submit"
            color="primary"
            large
            depressed
            @click.prevent.stop="doSignUp"
          >
            Sign up
          </v-btn>

          <div class="mt-4">
            <a href="" @click.prevent="mode = 'signIn'">
              Already have an account?
            </a>
          </div>
        </template>
        <template v-else-if="mode === 'signIn'">
          <v-btn
            :disabled="!valid"
            :loading="signingIn"
            type="submit"
            color="primary"
            large
            depressed
            @click.prevent.stop="doSignIn"
          >
            Sign in
          </v-btn>

          <div class="mt-4">
            <a @click.prevent="mode = 'signUp'">Create an account</a>
            <br />
            <a @click.prevent="mode = 'reset'">Reset password</a>
          </div>
        </template>
        <template
          v-else-if="
            mode === 'reset' ||
            mode === 'verifySignUp' ||
            mode === 'verifySignIn'
          "
        >
          <v-btn
            :disabled="!valid"
            :loading="verifying"
            type="submit"
            color="primary"
            class="mr-4"
            large
            depressed
            @click.prevent.stop="
              () => (mode === 'reset' ? doReset() : doVerify())
            "
          >
            Verify </v-btn
          ><v-btn
            v-if="mode !== 'reset'"
            :loading="reverifying"
            color="primary primary--text lighten-1"
            large
            depressed
            @click.prevent.stop="doReverify"
          >
            Resend code
          </v-btn>

          <div
            v-if="mode !== 'verifySignUp' && mode !== 'verifySignIn'"
            class="mt-4"
          >
            <a @click.prevent="mode = 'signIn'"> Sign in </a>
          </div>
        </template>
        <template v-else-if="mode === 'verifyReset'">
          <v-btn
            :disabled="!valid"
            :loading="resetting"
            type="submit"
            color="primary"
            large
            depressed
            @click.prevent.stop="doVerify"
          >
            Reset password
          </v-btn>

          <div class="mt-4">
            <a @click.prevent="mode = 'signIn'">Sign in</a>
          </div>
        </template>
      </v-form>
    </v-card-text>
    <v-card-text v-else>
      <p>You are signed in.</p>

      <v-btn
        :loading="signingOut"
        color="primary"
        large
        depressed
        @click.stop="doSignOut"
      >
        Sign out
      </v-btn>
    </v-card-text>
    <v-card-actions v-if="mode === 'confirm'">
      <v-spacer />

      <v-btn color="accent" text @click.prevent.stop="$emit('close')">
        Cancel
      </v-btn>
      <v-btn
        :disabled="!valid"
        :loading="confirming"
        color="accent"
        text
        @click.prevent.stop="doConfirm"
      >
        Continue
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { mdiEye, mdiEyeOff } from '@mdi/js'

export default {
  props: {
    fluid: {
      type: Boolean,
      default: false,
    },
    modeSignUp: {
      type: Boolean,
      default: false,
    },
    modeReset: {
      type: Boolean,
      default: false,
    },
    modeContinue: {
      type: Boolean,
      default: false,
    },
    modeConfirm: {
      type: Boolean,
      default: false,
    },
    noBanner: {
      type: Boolean,
      default: false,
    },
    welcome: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      mode: this.modeSignUp
        ? 'signUp'
        : this.modeReset
        ? 'reset'
        : this.modeConfirm
        ? 'confirm'
        : 'signIn',
      error: '',
      nextError: '',
      subscribe: false,
      success: '',
      mdiEye,
      mdiEyeOff,
      nextSuccess: '',
      newAccount: false,
      showPassword: false,
      signingIn: false,
      signingUp: false,
      signingOut: false,
      verifying: false,
      reverifying: false,
      resetting: false,
      confirming: false,
      valid: false,
      email: '',
      emailRules: [
        (v) => !!v || 'Email address is required',
        (v) => /@/.test(v) || 'Email address is invalid',
      ],
      code: '',
      codeRules: [(v) => !!v || 'Code is required'],
      password: '',
      passwordRules: [
        (v) => !!v || 'Password is required',
        (v) => v.length >= 8 || 'Please enter 8 or more characters',
      ],
    }
  },
  computed: {
    ...mapState({
      isSignedIn: ({ user }) => user.isSignedIn,
      user: ({ user }) => user.attrs,
    }),
  },
  watch: {
    mode() {
      this.$refs.form.resetValidation()

      this.success = this.nextSuccess
      this.error = this.nextError

      this.nextSuccess = ''
      this.nextError = ''
    },
  },
  methods: {
    ...mapActions({
      signIn: 'user/signIn',
      signUp: 'user/signUp',
      signOut: 'user/signOut',
      verifyReset: 'user/verifyReset',
      verifySignIn: 'user/verifySignIn',
      reverifySignIn: 'user/reverifySignIn',
      verifySignUp: 'user/verifySignUp',
      reverifySignUp: 'user/reverifySignUp',
      reset: 'user/reset',
    }),
    async doSignIn() {
      this.success = ''
      this.error = ''

      if (this.$refs.form.validate()) {
        this.signingIn = true

        try {
          await this.signIn({ username: this.email, password: this.password })

          if (this.user.email_verified !== 'true') {
            this.mode = 'verifySignIn'
          } else if (this.newAccount && this.welcome) {
            this.$router.push('/welcome/')
          }
        } catch (error) {
          if (error.code === 'UserNotConfirmedException') {
            try {
              this.mode = 'verifySignUp'
            } catch (error) {
              this.error = error.message || error.toString()
            }
          } else {
            this.error = error.message || error.toString()
          }
        }

        this.signingIn = false
      }
    },
    async doSignUp() {
      this.success = ''
      this.error = ''

      let recaptchaToken = ''

      try {
        this.signingUp = true

        recaptchaToken = await this.$recaptcha.getResponse()

        await this.$recaptcha.reset()
      } catch (error) {
        this.signingUp = false

        this.error = 'Are you a robot?'

        return
      }

      if (this.$refs.form.validate()) {
        this.signingUp = true

        if (this.subscribe) {
          try {
            await this.$axios.put(`subscribers/${this.email}`)
          } catch (error) {
            // Do nothing
          }
        }

        try {
          await this.signUp({
            username: this.email,
            password: this.password,
            recaptchaToken,
          })

          this.mode = 'verifySignUp'
          this.nextSuccess = 'Please check your email for a verification code'
        } catch (error) {
          this.error = error.message || error.toString()
        }

        this.signingUp = false
      }
    },
    async doSignOut() {
      this.success = ''
      this.error = ''
      this.signingOut = true

      try {
        await this.signOut()

        this.success = 'You have been signed out'
      } catch (error) {
        this.error = error.message || error.toString()
      }

      this.signingOut = false
    },
    async doReset() {
      this.success = ''
      this.error = ''

      if (this.$refs.form.validate()) {
        this.verifying = true

        try {
          await this.reset({ username: this.email })

          this.mode = 'verifyReset'
          this.nextSuccess = 'Please check your email for a verification code'
        } catch (error) {
          this.error = error.message || error.toString()
        }

        this.verifying = false
      }
    },
    async doVerify() {
      this.success = ''
      this.error = ''

      if (this.$refs.form.validate()) {
        this.resetting = true

        try {
          if (this.mode === 'verifyReset') {
            await this.verifyReset({
              username: this.email,
              password: this.password,
              code: this.code,
            })

            this.mode = 'signIn'
            this.nextSuccess = 'Your password has been reset.'
          } else if (this.mode === 'verifySignUp') {
            await this.verifySignUp({
              username: this.email,
              code: this.code,
            })

            this.newAccount = true
            this.mode = 'signIn'
            this.nextSuccess = 'Thank you for signing up! You can now sign in.'

            this.$gtm.push({ event: 'signUp' })
          } else if (this.mode === 'verifySignIn') {
            await this.verifySignIn({
              code: this.code,
            })
          }
        } catch (error) {
          this.error = error.message || error.toString()
        }

        this.resetting = false
      }
    },
    async doReverify() {
      this.reverifying = true
      this.success = ''
      this.error = ''

      try {
        if (this.mode === 'verifySignIn') {
          await this.reverifySignIn({ username: this.email })
        } else if (this.mode === 'verifySignUp') {
          await this.reverifySignUp({ username: this.email })
        }

        this.success = 'Please check your email for a verification code'
      } catch (error) {
        this.error = error.message || error.toString()
      }

      this.reverifying = false
    },
    async doConfirm() {
      this.success = ''
      this.error = ''

      if (this.$refs.form.validate()) {
        this.confirming = true

        try {
          await this.signIn({
            username: this.user.email,
            password: this.password,
          })

          this.$emit('confirm')
        } catch (error) {
          this.error = error.message || error.toString()
        }

        this.confirming = false
      }
    },
  },
}
</script>
