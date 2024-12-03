<script setup lang="ts">
import CreateGroup from "@/components/Grouping/CreateGroup.vue";
import { fetchy } from "@/utils/fetchy";
import { onMounted, ref } from "vue";

interface Group {
  _id: string;
  name: string;
  organizer: string;
  members: string[];
}

const groups = ref<Group[]>([]);

const fetchGroups = async () => {
  try {
    groups.value = await fetchy("/api/groups", "GET");
  } catch (e) {
    console.error("error fetching groups:", e);
  }
};

onMounted(fetchGroups);
</script>

<template>
  <CreateGroup @group-created="fetchGroups" />
</template>

<style scoped>
div {
  margin-bottom: 1.5em;
}
</style>
