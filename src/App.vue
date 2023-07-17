<template>
  <div id="app">
    <Input/>
<!--    <div class="wrapper">-->
      <UserCard />
<!--    </div>-->
  </div>
</template>

<script>

import Input from "@/components/Input.vue";
import UserCard from "@/components/UserCard.vue";

import { ref, onMounted } from "vue";
import { useStore } from "vuex";

export default {
  components: {UserCard,Input},

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

    return { searchResults };
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
</style>
