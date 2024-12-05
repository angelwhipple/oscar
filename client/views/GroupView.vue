<script setup lang="ts">
import router from "@/router";
import { fetchy } from "@/utils/fetchy";
import { onMounted, ref } from "vue";
import GroupList from "../components/Grouping/GroupList.vue";

export interface Group {
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
  void router.push({
    name: "InternalGroup",
    params: { groupId: group._id },
  });
};

onMounted(fetchGroups);
</script>

<template>
  <!-- <FetchGroupsByOrganizer @groups-fetched="groups = $event" /> -->
  <GroupList :groups="groups" @group-selected="selectGroup" />
</template>

<style scoped>
div {
  margin-bottom: 1.5em;
}
</style>
