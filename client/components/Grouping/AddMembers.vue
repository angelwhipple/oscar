<script setup lang="ts">
import { useGroupStore } from "@/stores/group";
import { defineEmits, defineProps, ref } from "vue";

const props = defineProps(["groupId"]);
const groupStore = useGroupStore();

const newMember = ref("");

const inviteMember = async () => {
  if (!props.groupId) return
  await groupStore.sendGroupInvitation(props.groupId, newMember.value);
  newMember.value = ""
};
</script>

<template>
  <div class="add-member-container">
    <form @submit.prevent="inviteMember" class="add-member-form">
      <label for="newMember" class="form-label">Invite a member</label>
      <input id="newMember" v-model="newMember" required class="input-field" placeholder="Enter username" />
      <button type="submit" class="add-button">Invite</button>
    </form>
  </div>
</template>

<style scoped>
.add-member-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 1.5em;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  background-color: #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.add-member-form {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

.form-label {
  font-weight: bold;
  margin-bottom: 0.5em;
}

.input-field {
  padding: 0.75em;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.input-field:focus {
  border-color: #007bff;
  outline: none;
}

.add-button {
  background-color: #28a745;
  color: #fff;
  border: none;
  padding: 0.75em 1.5em;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.add-button:hover {
  background-color: #218838;
}
</style>
