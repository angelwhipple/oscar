<script setup lang="ts">
import { useUserStore } from "@/stores/user";
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
const userStore = useUserStore();

const selectGroup = (group: Group) => {
  emit("group-selected", group);
};
</script>

<template>
  <div class="group-list-container">
    <h2>Groups</h2>
    <div class="group-list">
      <div
        v-for="group in groups"
        :key="group._id"
        class="group-item"
        @click="selectGroup(group)"
        :class="{ organizer: group.organizer === userStore.currentUserId, member: group.organizer !== userStore.currentUserId }"
      >
        <span class="group-name">{{ group.name }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.group-list-container {
  text-align: center;
  padding: 2em;
}

.group-list {
  display: flex;
  justify-content: center;
  gap: 2em;
  flex-wrap: wrap;
  margin: 2em 0;
}

.group-item {
  width: 120px;
  height: 120px;
  background-color: #7d7da1; /* Matches the purple color in the image */
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  font-size: 0.9rem;
  font-weight: bold;
  transition:
    transform 0.3s ease,
    background-color 0.3s ease;
}

.group-item:hover {
  background-color: #6b6b8a; /* Slightly darker purple for hover effect */
  transform: scale(1.1);
}

.group-name {
  text-align: center;
  line-height: 1.2em;
}

/* Coloring based on group organizer and member  */
.group-item.organizer {
  background-color: #262771;
  color: white;
}

.group-item.member {
  background-color: #9393b8;
  color: white;
}
</style>
