export const state = () => ({
  display: 'card' //default
})

export const getters = {
  get (state) {
    return  state.display
  }
}

export const mutations = {
  toggleDisplay(state) {
    if(state.display === 'card') {
      state.display = 'list'
    } else {
      state.display = 'card'
    }
  }
}
