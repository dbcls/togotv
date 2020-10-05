export const state = () => ({
  display: 'card', //default,
  sp_menu_toggle_state: {
    search_videos: false,
    contact: false
  }
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
  },
  toggleSPMenu(state, type) {
    state.sp_menu_toggle_state[type] = !state.sp_menu_toggle_state[type]
  }
}
