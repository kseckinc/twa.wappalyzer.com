export const state = () => ({
  loading: true,
  credits: null,
  freeLists: { total: null, remaining: null, availableAt: null },
  pro: false,
})

export const mutations = {
  setCredits(state, credits) {
    state.credits = credits
  },
  setFreeLists(state, freeLists) {
    state.freeLists = freeLists
  },
  setPro(state, pro) {
    state.pro = pro
  },
  setLoading(state, loading) {
    state.loading = loading
  },
}

export const actions = {
  async get({ state, commit, dispatch }) {
    try {
      commit('setLoading', true)

      const { credits, freeLists, pro } = (await this.$axios.get('credits'))
        .data

      commit('setCredits', credits)
      commit('setFreeLists', freeLists)
      commit('setPro', pro)
      commit('setLoading', false)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)

      commit('setCredits', 0)
      commit('setFreeLists', { total: 0, remaining: 0, availableAt: null })
      commit('setPro', false)
      commit('setLoading', false)
    }
  },
  reset({ commit }) {
    commit('setCredits', 0)
    commit('setFreeLists', { total: 0, remaining: 0, availableAt: null })
    commit('setPro', false)
    commit('setLoading', false)
  },
}
