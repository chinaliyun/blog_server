export const state = () => ({
  counter: 0,
  fetch: {},
})

export const mutations = {
  changeCounter(state, v) {
    state.counter = v
  },
  changeFetch(state, v) {
    state.fetch = v
  },
}
