<script setup lang="ts">
import { defineEmits, defineProps } from "vue";

interface Group {
  _id: string;
  name: string;
  organizer: string;
}

const props = defineProps<{
  groups: Group[];
}>();
const emit = defineEmits(["group-selected"]);

const selectGroup = (group: Group) => {
  emit("group-selected", group);
};
</script>

<template>
  <div class="group-list-container">
    <h2>Groups</h2>
    <ul class="group-list">
      <li v-for="group in groups" :key="group._id" @click="selectGroup(group)" class="group-item">
        <div class="group-details">
          <span class="group-name">{{ group.name }}</span>
          <span class="group-organizer">(Organizer: {{ group.organizer }})</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.group-list-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 2em;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  background-color: #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.group-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.group-item {
  cursor: pointer;
  margin: 0.75em 0;
  padding: 1em;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  transition:
    background-color 0.3s ease,
    box-shadow 0.3s ease;
  display: flex;
  align-items: center;
}

.group-item:hover {
  background-color: #f9f9f9;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.group-details {
  display: flex;
  flex-direction: column;
}

.group-name {
  font-weight: bold;
  font-size: 1.1rem;
}

.group-organizer {
  font-size: 0.9rem;
  color: #6c757d;
  margin-top: 0.25em;
}
</style>
