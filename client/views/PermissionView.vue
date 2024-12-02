<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import PermissionForm from "../components/Permission/PermissionForm.vue";

const { currentUsername } = storeToRefs(useUserStore());
</script>

<template>
  <div class="permission-view">
    <h1>Welcome, {{ currentUsername }}</h1>
    <PermissionForm />
  </div>
</template>

<style scoped>
.permission-view {
  text-align: center;
}
</style>
