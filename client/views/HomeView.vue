<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import GroupView from "@/views/GroupView.vue";
import { storeToRefs } from "pinia";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
</script>

<template>
  <main>
    <h1>Home Page</h1>
    <section>
      <h1 v-if="isLoggedIn">Welcome {{ currentUsername }}!</h1>
      <h1 v-else>Please login!</h1>
    </section>
    <section v-if="isLoggedIn">
      <GroupView />
    </section>
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}

section {
  margin: 1rem 0;
}
</style>
