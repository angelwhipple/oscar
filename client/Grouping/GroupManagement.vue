<script setup lang="ts">
import CreateGroup from "@/Grouping/CreatGroup.vue";
import FetchGroupsByOrganizer from "@/Grouping/FetchGroupByOrganizer.vue";
import GroupList from "@/Grouping/GroupList.vue";
import ManageGroup from "@/Grouping/ManageGroup.vue";
import { fetchy } from "@/utils/fetchy";
import { onMounted, ref } from "vue";

interface Group {
  _id: string;
  name: string;
  organizer: string;
  members: string[];
}

const groups = ref<Group[]>([]);
const selectedGroup = ref<Group | null>(null);

const fetchGroups = async () => {
  try {
    groups.value = await fetchy("/api/groups", "GET");
  } catch (e) {
    console.error("error fetching groups:", e);
  }
};

const selectGroup = (group: Group) => {
  selectedGroup.value = group;
};

onMounted(fetchGroups);
</script>

<template>
  <CreateGroup @group-created="fetchGroups" />
  <FetchGroupsByOrganizer @groups-fetched="groups = $event" />
  <GroupList :groups="groups" @group-selected="selectGroup" />
  <div v-if="selectedGroup">
    <ManageGroup :group="selectedGroup" @group-updated="fetchGroups" />
  </div>
</template>

<style scoped>
div {
  margin-bottom: 1.5em;
}
</style>
