<template>
  <div class="input">
    <div class="input__body">
      <input @keyup.enter="searchRepositories" v-model="searchQuery" className="input__inner" type="text"
             placeholder="Начните вводить текст для поиска (не менее трех символов)">
      <button type="submit" class="input__btn" @click="searchRepositories ">Search</button>
    </div>
  </div>
</template>

<script>
import {ref} from "vue";
import axios from "axios";
import {useStore} from "vuex";

export default {
  setup() {
    const searchQuery = ref("");
    const store = useStore();

    const searchRepositories = async () => {
      try {
        store.commit("SET_LOADING", true)
        const response = await axios.get('https://api.github.com/search/repositories', {
          params: {
            q: searchQuery.value,
            per_page: 100,
          },
        });
        const searchResults = response.data.items;
        store.commit("SET_SEARCH_RESULT", searchResults);
        localStorage.setItem("searchResults", JSON.stringify(searchResults));
      } catch (error) {
        console.error(error);
      } finally {
        store.commit('SET_LOADING', false);
      }
    };

    return {
      searchQuery,
      searchRepositories,
      loading: store.state.loading
    };
  },
};
</script>

<style lang="scss" scoped>
.input {
  background: rgba(162, 163, 164, 1);
  max-height: 147px;
  border: 1px solid #A2A3A4;
  padding: 0 10px;

  &__body {
    max-width: 1376px;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 32px;
    padding-bottom: 47px;
  }

  &__inner {
    height: 68px;
    width: 100%;
    padding-left: 48px;
    font-size: 19px;
  }

  &__btn {
    color: white;
    background: #00A3FF;
    width: 74px;
    height: 68px;
    border: none;
    font-size: 18px;
    cursor: pointer;
  }
}
</style>
