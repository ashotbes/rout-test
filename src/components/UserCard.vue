<template>
  <div class="wrapper">
    <div class="user__card" v-for="item in paginatedResults" :key="item.id">
      <div class="user__project-name">
        <div style="display: flex; justify-content: center; align-items: center; gap: 5px">
          Название проекта: <a :href="item.html_url" target="_blank">{{ projectName(item.id) }}</a>
          <img @click="editProjectName(item.id)" src="@/images/edit.svg"
               style="cursor:pointer; width: 25px; height: 25px" alt="">
        </div>
        <img @click="removeCard(item.id)" style="height: 25px; width: 25px; cursor: pointer" src="@/images/delete.svg"
             alt="">
      </div>

      <div class="user__author">
        <img style="height: 48px; width: 48px;" :src="item.owner.avatar_url" alt="">
        <p>Author: <a :href="item.owner.html_url" target="_blank">{{ item.owner.login }}</a></p>
      </div>
      <div class="user__views">
        <img src="@/images/start.svg" alt="">
        <span>{{ item.stargazers_count }}</span>
        <img src="@/images/eye.svg" alt="">
        <span>{{ item.watchers_count }}</span>
      </div>

      <div class="user__comments">
        <input v-model="newComments[item.id]" @keydown.enter="addComment(item.id)" class="comments__input" type="text"
               placeholder="Комментарий к проекту">
        <button class="comments__btn" @click="addComment(item.id)">Add</button>
      </div>

      <div class="show__more">
        <p style="cursor: pointer" @click="toggleComments(item.id)">Show Comments</p>

        <p style="cursor: pointer;" @click="toggleShowMore(item.id)">Show more</p>
        <div class="modal-wrapper" v-if="showMore[item.id]">
          <div class="modal">
            <button class="modal__btn" @click="toggleShowMore(item.id)">x</button>
            <h3>About: {{ item.description }}</h3>
            <h4>Private: {{ item.private }}</h4>
            <h4>Created at: {{
                new Date(item.created_at).toLocaleString("default", {
                  month: "long",
                  year: "numeric",
                  day: "numeric"
                })
              }}</h4>
            <h4>SSH_URL: {{ item.ssh_url }}</h4>
            <h4>CLONE_URL: {{ item.clone_url }}</h4>
            <h4>Homepage: {{ item.homepage }}</h4>
          </div>
        </div>
      </div>

      <div v-for="comment in getCommentsByCardId(item.id)" :key="comment.id" v-show="isCommentsVisible(item.id)"
           class="user__comment">
        {{ comment.text }}
      </div>
    </div>
  </div>

  <div class="pagination" v-if="totalPages > 1">
    <button class="pagination__btn" :class="{ active: isActivePage(pageNumber) }" v-for="pageNumber in totalPages"
            :key="pageNumber" @click="setCurrentPage(pageNumber)">
      {{ pageNumber }}
    </button>

    <div class="pagination-per-page">
      <label for="per-page">Количество карточек на странице:</label>
      <select id="per-page" v-model="perPage" @change="updatePageSize">
        <option v-for="option in perPageOptions" :value="option">{{ option }}</option>
      </select>
    </div>
  </div>
  <div class="loader" v-if="loading"></div>

</template>

<script>
import {useStore} from "vuex";
import {computed, ref, reactive, watch} from "vue";

export default {
  setup() {
    const store = useStore();
    const searchResults = computed(() => store.state.searchResults);
    const loading = computed(() => store.state.loading);
    const comments = ref([]);
    const newComments = reactive({});
    const visibleComments = reactive({});
    const showMore = reactive({});
    const projectNames = reactive({});
    const currentPage = ref(1);
    const perPage = ref(9);
    const perPageOptions = [9, 15, 25, 50, 100];

    const paginatedResults = computed(() => {
      const startIndex = (currentPage.value - 1) * perPage.value;
      const endIndex = startIndex + perPage.value;
      return searchResults.value.slice(startIndex, endIndex);
    });

    const totalPages = computed(() => Math.ceil(searchResults.value.length / perPage.value));

    const setCurrentPage = (page) => {
      currentPage.value = page;
    };

    const updatePageSize = () => {
      setCurrentPage(1);
    };

    const projectName = (id) => {
      return computed(() => projectNames[id] || getItemName(id));
    };

    const editProjectName = (id) => {
      const newName = prompt("Введите новое название проекта:");
      if (newName) {
        store.commit("SET_PROJECT_NAME", {id, name: newName});
        projectNames[id] = newName;
      }
    };

    const getItemName = (id) => {
      const item = searchResults.value.find((item) => item.id === id);
      return item ? item.name : "";
    };

    const getCommentsByCardId = (cardId) => {
      return comments.value.filter((comment) => comment.cardId === cardId);
    };

    const removeCard = (id) => {
      store.commit("REMOVE_CARD", id);
    };

    const addComment = (cardId) => {
      comments.value.push({cardId, text: newComments[cardId]});
      newComments[cardId] = "";
    };

    const toggleComments = (cardId) => {
      visibleComments[cardId] = !visibleComments[cardId];
    };

    const isCommentsVisible = (cardId) => {
      return visibleComments[cardId];
    };

    const toggleShowMore = (cardId) => {
      showMore[cardId] = !showMore[cardId];
      if (showMore[cardId]) {
        document.body.classList.add("modal-open");
      } else {
        document.body.classList.remove("modal-open");
      }
    };

    const isActivePage = (page) => {
      return page === currentPage.value;
    };

    watch([searchResults, perPage], () => {
      setCurrentPage(1);
    });

    return {
      searchResults,
      comments,
      newComments,
      getCommentsByCardId,
      removeCard,
      addComment,
      loading,
      toggleComments,
      isCommentsVisible,
      toggleShowMore,
      showMore,
      projectName,
      editProjectName,
      paginatedResults,
      totalPages,
      currentPage,
      setCurrentPage,
      isActivePage,
      perPage,
      perPageOptions,
      updatePageSize,
    };
  },
};
</script>

<style lang="scss">
.wrapper {
  max-width: 1376px;
  margin: 0 auto;
  padding-top: 34px;
}

.user__card {
  padding: 0 15px;
  max-width: 440px;
  box-shadow: 0px 4px 4px 0px #00000040;
  width: 100%;
}

.user__project-name {
  font-size: 20px;
  padding-top: 8px;
  display: flex;
  justify-content: space-between;
}

.user__author {
  display: flex;
  gap: 15px;
  align-items: center;
  font-size: 18px;
  margin-top: 18px;
}

.user__views {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-top: 13px;
}

.user__comments{
  display: flex;
  margin-bottom: 15px;
  margin-top: 23px;
}

.comments__input {
  width: 100%;
  height: 54px;
  border: 1px solid #a2a3a4;
  padding-left: 13px;


  &::placeholder {
    font-size: 18px;
    font-weight: 400;
  }
}

.comments__btn {
  background: #00a3ff;
  width: 65px;
  border: none;
  cursor: pointer;
  color: white;
  font-size: 18px;
}

.loader {
  border: 16px solid #f3f3f3;
  border-top: 16px solid #3498db;
  border-radius: 50%;
  width: 120px;
  height: 120px;
  animation: spin 2s linear infinite;
  position: absolute;
  right: 50%;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

a {
  text-decoration: underline;
  text-decoration-color: black;
  color: black;
}

.modal {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  background: white;
  z-index: 45;
  word-wrap: break-word;
  padding: 0 15px;
  overflow-y: auto;
}

.modal-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 50;
  overflow-y: auto;
}

.modal__btn {
  position: absolute;
  right: 10px;
  top: 6px;
  border: none;
  background: none;
  font-size: 18px;
}

.modal-open {
  overflow: hidden;
}

.show__more {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 35px;
  margin-top: 30px;
  flex-wrap: wrap;
}

.pagination__btn {
  background: white;
  color: black;
  border: none;
  cursor: pointer;
  width: 25px;
  height: 25px;
}

.pagination button.active {
  background-color: #00a3ff;
  color: white;
}
</style>
