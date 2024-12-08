<script setup lang="ts">
import { ref, defineEmits } from "vue";
import { useGroupStore } from "@/stores/group";
import { useUserStore } from "@/stores/user";
import GroupList from "@/components/Grouping/GroupList.vue";
import { storeToRefs } from "pinia";

const emit = defineEmits(["cancel-discover"]);

const groupStore = useGroupStore();
const { allGroups } = storeToRefs(groupStore)
const { currentUserId } = storeToRefs(useUserStore());

const displayGroups = ref(allGroups.value);
const organizer = ref("");

const search = async (event: Event) => {
  event.preventDefault();
  if (!organizer.value) {
    displayGroups.value = allGroups.value;
  } else {
    displayGroups.value = await groupStore.filterGroupsByOrganizer(organizer.value);
  }
};

const request = async (groupId: string, organizer: string) => {
  await groupStore.sendGroupRequest(groupId, currentUserId.value.toString(), organizer, "request");
}
const goBack = () => emit("cancel-discover");
</script>

<template>
  <p class="opaque text-center">Request to join an open ROSCA group</p>
  <GroupList :groups="displayGroups" @selected-group="request"></GroupList>
  <div class="fetch-groups-container">
    <h2>Lookup by organizer</h2>
    <form @submit.prevent="search" class="fetch-groups-form">
      <div class="form-group">
        <input
          required
          id="organizerUsername"
          v-model="organizer"
          class="input-field"
          placeholder="Provide a username"
          @keydown.enter="search"
        />
      </div>
      <div class="form-actions">
        <button @click="goBack" class="fetch-button">Back</button>
        <button type="submit" class="fetch-button">Search</button>
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
  justify-content: space-between;
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
