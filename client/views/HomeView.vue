<script setup lang="ts">
import PostListComponent from "@/components/Post/PostListComponent.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

import GroupManagement from "@/Grouping/GroupManagement.vue";
// import CreateGroup from "@/Grouping/CreatGroup.vue";
// import GroupDetail from "@/Grouping/GroupDetail.vue";
// import GroupList from "@/Grouping/GroupList.vue";

// const refreshSchedules = ref(false);
// const handleRefreshSchedules = () => {
//   refreshSchedules.value = !refreshSchedules.value;
// };
const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
</script>

<template>
  <main>
    <h1>Home Page</h1>
    <section>
      <h1 v-if="isLoggedIn">Welcome {{ currentUsername }}!</h1>
      <h1 v-else>Please login!</h1>
    </section>
    <PostListComponent />

    <GroupManagement />
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
</style>
