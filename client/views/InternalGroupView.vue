<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import ManageGroup from "../components/Grouping/ManageGroup.vue";
import { fetchy } from "../utils/fetchy";

interface Group {
  _id: string;
  name: string;
  organizer: string;
  members: string[];
}

const route = useRoute();
const groupId = route.params.groupId as string;
const selectedGroup = ref<Group | null>(null);

async function getGroup() {
  try {
    selectedGroup.value = await fetchy(`/api/groups/${groupId}`, "GET");
  } catch (e) {
    console.error("error fetching group", e);
  }
}
onMounted(getGroup);
</script>

<template>
  <div v-if="selectedGroup">
    <ManageGroup :group="selectedGroup" />
  </div>
</template>
