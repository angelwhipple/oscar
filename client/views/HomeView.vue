<script setup lang="ts">
import PostListComponent from "@/components/Post/PostListComponent.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

import ScheduleListComponent from "@/components/Scheduling/CreateScheduleForm.vue";
import { ref } from "vue";

const refreshSchedules = ref(false);
const handleRefreshSchedules = () => {
  refreshSchedules.value = !refreshSchedules.value;
};
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
    <!-- <ScheduleListComponent v-if="refreshSchedules" /> -->
    <ScheduleListComponent />
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
</style>
