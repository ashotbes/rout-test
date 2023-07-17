import { createStore } from 'vuex'

export default createStore({
  state: {
    searchResults: [],
    loading: false,
    projectNames: {}
  },
  getters: {
  },
  mutations: {
    SET_SEARCH_RESULT(state,results){
      state.searchResults = results;
      localStorage.setItem('searchResults', JSON.stringify(results))
    },
    SET_LOADING(state,value){
      state.loading = value
    },
    REMOVE_CARD(state,id){
      state.searchResults = state.searchResults.filter(item => item.id !== id);
      localStorage.setItem('searchResults', JSON.stringify(state.searchResults))
    },
    SET_PROJECT_NAME(state, payload) {
      state.projectNames[payload.id] = payload.name;
    },


  },
  actions: {
  },
  modules: {
  }
})
