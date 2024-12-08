<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { defineEmits, defineProps } from "vue";

const props = defineProps(["groups"])
const emit = defineEmits(["selected-group"]);

const userStore = useUserStore();

const select = (groupId: string, organizer: string) => {
  emit("selected-group", groupId, organizer);
};
</script>

<template>
  <div class="group-list">
    <div
      v-if="props.groups.length > 0"
      v-for="group in props.groups"
      :key="group._id.toString()"
      class="group-item"
      @click="select(group._id.toString(), group.organizer.toString())"
      :class="{
        organizer: group.organizer.toString() === userStore.currentUserId.toString(),
        member: group.organizer.toString() !== userStore.currentUserId.toString() }"
    >
      <span class="group-name">{{ group.name }}</span>
    </div>
    <div v-else>
      <p class="opaque">No groups to display.</p>
    </div>
  </div>
</template>

<style scoped>
.group-list {
  display: flex;
  justify-content: center;
  gap: 2em;
  flex-wrap: wrap;
  margin: 2em 0;
  padding: 1em;
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
