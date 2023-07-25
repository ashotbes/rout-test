<template>
  <div id="app">
    <Input/>
    <MyButton @click="clearAll" class="my-btn">Clear All</MyButton>
    <UserCard/>
  </div>
</template>

<script>

import Input from "@/components/Input.vue";
import UserCard from "@/components/UserCard.vue";

import {ref, onMounted} from "vue";
import {useStore} from "vuex";
import MyButton from "@/components/MyButton.vue";

export default {
  components: {MyButton, UserCard, Input},

  setup() {
    const store = useStore();
    const searchResults = ref([]);

    onMounted(() => {
      const savedResults = localStorage.getItem("searchResults");
      if (savedResults) {
        searchResults.value = JSON.parse(savedResults);
        store.commit("SET_SEARCH_RESULT", searchResults.value);
      }
    });

    const clearAll = () => {
      searchResults.value = [];
      store.commit("SET_SEARCH_RESULT", []);
      localStorage.removeItem("searchResults");
    };

    return {searchResults, clearAll};
  }
}
</script>

<style>
@import "global.css";

.wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  max-width: 1376px;
  margin: 0 auto;
  gap: 28px;
  padding-top: 34px;
}

.my-btn{
  position: absolute;
  left: 70%;
  margin-top: 12px;
}

</style>
