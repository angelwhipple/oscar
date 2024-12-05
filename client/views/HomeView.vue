<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import GroupView from "@/views/GroupView.vue";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";
import PermissionForm from "@/components/Permission/PermissionForm.vue";

const userStore = useUserStore();
const { currentUsername, isLoggedIn } = storeToRefs(userStore);

const isNewMember = ref(true);

onMounted(async () => {
  isNewMember.value = await userStore.checkNewMember(userStore.currentUserId);
})
</script>

<template>
  <main>
    <h1>Home Page</h1>
    <section>
      <h1 v-if="isLoggedIn">Welcome {{ currentUsername }}!</h1>
      <h1 v-else>Please login!</h1>
    </section>
    <section v-if="isLoggedIn">
      <PermissionForm v-if="isNewMember" />
      <GroupView v-else/>
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
