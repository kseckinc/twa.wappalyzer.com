const publicRuntimeConfig = {
  AWS_REGION: 'ap-southeast-2',
  COGNITO_USER_POOL_ID: 'ap-southeast-2_Tz6DGDkmB',
  COGNITO_CLIENT_ID: '17uprj6843uiev15qqdkn3l5h7',
  COGNITO_IDENTITY_POOL_ID:
    'ap-southeast-2:6b7b7db4-96fd-450f-88fc-2a6feb55cb8e',
  BASE_URL: 'https://api.wappalyzer.com/',
  ...(process.env.NODE_ENV === 'development' ||
  process.env.ENVIRONMENT === 'beta'
    ? {
        API_VERSION: 'beta',
        WEBSITE_URL: 'https://www.wappalyzer.com',
      }
    : {
        API_VERSION: 'v2',
        WEBSITE_URL: 'https://www.wappalyzer.com',
      }),
}

export default {
  target: 'static',
  generate: {
    fallback: '200.html',
  },
  publicRuntimeConfig,
  head: {
    titleTemplate: () => 'Wappalyzer',
    meta: [
      { charset: 'utf-8' },
      { theme_color: '#4608ad' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    ],
    link: [
      {
        rel: 'preconnect',
        href: 'https://www.googletagmanager.com',
      },
      {
        rel: 'apple-touch-icon',
        href: '/apple-touch-icon.png',
      },
    ],
  },
  loading: false,
  css: ['~/assets/scss/styles.scss'],
  plugins: [
    '~/plugins/vuetify.js',
    '~/plugins/axios.js',
    '~/plugins/mixins.js',
  ],
  buildModules: ['@nuxtjs/eslint-module', '@nuxtjs/svg', '@nuxtjs/vuetify'],
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    'cookie-universal-nuxt',
    '@nuxtjs/gtm',
    '@nuxtjs/recaptcha',
  ],
  gtm: {
    id: 'GTM-MC85KCD',
    pageTracking: true,
    respectDoNotTrack: false,
  },
  recaptcha: {
    siteKey: '6LeW3NobAAAAACuVCOX8MLhIHtJCitFkuUZjRPRo',
    version: 2,
  },
  axios: {
    baseURL: publicRuntimeConfig.BASE_URL,
    secure: true,
    retry: { retries: 1, retryDelay: () => 500 },
  },
  vuetify: {
    customVariables: ['~/assets/scss/variables.scss'],
    defaultAssets: false,
    treeShake: true,
    options: {
      customProperties: true,
    },
    theme: {
      dark: false,
      themes: {
        light: {
          primary: {
            base: '#4608ad',
            lighten1: '#f0ebf9',
            lighten2: '#f4f1fa',
            darken1: '#32067c',
            darken2: '#150233',
          },
          accent: '#2196f3',
          secondary: '#fafafa',
          anchor: '#2196f3',
        },
      },
    },
  },
  pwa: {
    manifest: {
      name: 'Wappalyzer',
      short_name: 'Wappalyzer',
      description: 'Identify technologies on websites.',
      theme_color: '#32067c',
      share_target: {
        action: '/',
        params: {
          title: 'title',
          text: 'text',
          url: 'url',
        },
      },
    },
  },
  build: {
    extend(config, ctx) {},
    followSymlinks: true,
  },
  hooks: {
    'build:done'() {
      const modulesToClear = ['vue', 'vue/dist/vue.runtime.common.prod']
      modulesToClear.forEach((entry) => {
        delete require.cache[require.resolve(entry)]
      })
    },
  },
}
