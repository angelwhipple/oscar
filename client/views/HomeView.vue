<script setup lang="ts">
import PermissionForm from "@/components/Permission/PermissionForm.vue";
import { useUserStore } from "@/stores/user";
import GroupView from "@/views/GroupView.vue";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";

const userStore = useUserStore();
const { currentUsername, isLoggedIn } = storeToRefs(userStore);

const isNewMember = ref(true);

const refreshIsNewMember = async () => {
  isNewMember.value = await userStore.checkNewMember(userStore.currentUserId);
};

onMounted(async () => {
  await refreshIsNewMember();
});
</script>

<template>
  <main>
    <section v-if="isLoggedIn">
      <PermissionForm v-if="isNewMember" @selected-permissions="refreshIsNewMember" />
      <GroupView v-else />
    </section>
    <section v-else>
      <h1>Home Page</h1>
      <h1>Please login!</h1>
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
