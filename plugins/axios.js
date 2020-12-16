function getAuth(state) {
  // API Gateway doesn't allow token re-use across resources
  return `${Math.random().toString(36).substr(2, 5)} ${state.user.idToken} ${
    state.user.impersonating
  }`
}

// eslint-disable-next-line handle-callback-err
export default ({ store: { dispatch, state }, $axios }) => {
  $axios.onRequest((config) => {
    if (!/^https?:/.test(config.url)) {
      config.headers.common.Authorization = getAuth(state)

      if (!config.apiVersioned) {
        config.url = config.url.replace(
          /^([^/]+)/,
          `$1/${process.env.API_VERSION}`
        )

        config.apiVersioned = true
      }
    }

    return config
  })

  $axios.onError(async (error) => {
    if (
      error.config &&
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      if (state.user.isSignedIn) {
        await dispatch('user/refresh')

        if (!error.config.retry) {
          error.config.retry = true
          error.config.headers.Authorization = getAuth(state)

          return $axios.request(error.config)
        }
      }
    }

    return Promise.reject(error)
  })
}
