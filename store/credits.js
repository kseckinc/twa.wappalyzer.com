export const state = () => ({
  credits: null,
})

export const mutations = {
  set(state, credits) {
    state.credits = credits
  },
}

export const actions = {
  async get({ state, commit, dispatch }, attributes) {
    try {
      const { credits } = (await this.$axios.get('credits')).data

      commit('set', credits)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)

      commit('set', 0)
    }
  },
}
