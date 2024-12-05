<script setup lang="ts">
import { ref } from "vue";
import { useGroupStore } from "@/stores/group";

const groupStore = useGroupStore();
const organizerUsername = ref("");

const fetchGroupsByOrganizer = async () => {
  await groupStore.filterGroupsByOrganizer(organizerUsername.value);
};
</script>

<template>
  <div class="fetch-groups-container">
    <h2>Lookup Groups by Organizer</h2>
    <form @submit.prevent="fetchGroupsByOrganizer" class="fetch-groups-form">
      <div class="form-group">
        <label for="organizerUsername">Organizer Username:</label>
        <input id="organizerUsername" v-model="organizerUsername" required class="input-field" />
      </div>
      <div class="form-actions">
        <button type="submit" class="fetch-button">Fetch Groups</button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.fetch-groups-container {
  max-width: 500px;
  margin: 0 auto;
  padding: 2em;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  background-color: #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.fetch-groups-form {
  display: flex;
  flex-direction: column;
  gap: 1.5em;
}

.form-group {
  display: flex;
  flex-direction: column;
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

.form-actions {
  display: flex;
  justify-content: flex-start;
  margin-top: 1em;
}

.fetch-button {
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 0.75em 1.5em;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

.fetch-button:hover {
  background-color: #0056b3;
}
</style>
