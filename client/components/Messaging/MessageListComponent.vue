<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { onMounted, ref } from "vue";

const groups = ref<Array<{ _id: string; name: string }>>([]);
const selectedGroup = ref<string | null>(null);
const emit = defineEmits(["selectGroup", "refreshMessages"]);

async function fetchGroups() {
  try {
    const groupResults = await fetchy("/api/groups", "GET");
    groups.value = groupResults;
  } catch (error) {
    console.error("Failed to fetch groups:", error);
    groups.value = [];
  }
}

function selectGroup(groupId: string) {
  selectedGroup.value = groupId;
  emit("selectGroup", groupId);
  emit("refreshMessages");
}

onMounted(fetchGroups);
</script>

<template>
  <div class="sidebar">
    <h2>Select Group</h2>
    <div class="group-container">
      <div class="group-block" v-for="group in groups" :key="group._id" @click="selectGroup(group._id)" :class="{ selected: group._id === selectedGroup }">
        {{ group.name }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.sidebar {
  width: 250px;
  height: 100vh;
  overflow-y: auto;
  padding: 20px;
}

.group-container {
  display: flex;
  flex-direction: column;
}

.group-block {
  border: 1px solid var(green);
  border-radius: 15px;
  padding: 15px;
  margin-bottom: 10px;
  cursor: pointer;
  background: var(white);
}

.selected {
  font-weight: bold;
  color: #000;
  background: var(blue);
  border: 2px solid var(blue);
  border-radius: 20px;
}
</style>
