export const state = () => ({
  display: "card", //default,
  sp_menu_toggle_state: {
    search_videos: false,
    contact: false,
  },
  youtube_API_token: null,
});

export const mutations = {
  toggleDisplay(state) {
    if (state.display === "card") {
      state.display = "list";
    } else {
      state.display = "card";
    }
  },
  toggleSPMenu(state, type) {
    state.sp_menu_toggle_state[type] = !state.sp_menu_toggle_state[type];
  },
  setToken(state, new_token) {
    state.youtube_API_token = new_token;
  },
};