<script setup lang="ts">
import { ref } from "vue";

const selectedPermission = ref("");

function selectPermission(permission: string) {
  selectedPermission.value = permission;
  alert(`You selected: ${permission}`);
}
</script>

<template>
  <div class="permission-form">
    <h3>What would you like to do?</h3>
    <div class="button-container">
      <button class="permission-button organizer" @click="selectPermission('organizer')">Organize a ROSCA Group</button>
      <button class="permission-button member" @click="selectPermission('member')">Join a ROSCA group as a Member</button>
    </div>
  </div>
</template>

<style scoped>
.permission-form {
  text-align: center;
}

.button-container {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
}

.permission-button {
  width: 200px;
  height: 100px;
  word-wrap: break-word;
  padding: 1rem 2rem;
  font-size: 1.2rem;
}

.organizer {
  background-color: #262771;
  color: white;
}

.member {
  background-color: #9393b8;
  color: black;
}
</style>
