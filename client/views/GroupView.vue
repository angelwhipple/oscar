<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { onMounted, ref } from "vue";
import CreateGroup from "../components/Grouping/CreateGroup.vue";
import FetchGroupsByOrganizer from "../components/Grouping/FetchGroupByOrganizer.vue";
import GroupList from "../components/Grouping/GroupList.vue";
import ManageGroup from "../components/Grouping/ManageGroup.vue";

import { useUserStore } from "@/stores/user";
interface Group {
  _id: string;
  name: string;
  organizer: string;
  members: string[];
}

const groups = ref<Group[]>([]);
const selectedGroup = ref<Group | null>(null);
const userStore = useUserStore();
const userRole = ref<string | null>(null);

const fetchGroups = async () => {
  try {
    const allGroups = await fetchy("/api/groups", "GET");
    console.log("UserName", userStore.currentUsername);
    // console.log("All Groups", allGroups);
    console.log("Current User", userStore.currentUserId);

    groups.value = allGroups.filter((group: Group) => {
      return group.organizer === userStore.currentUserId || group.members?.includes(userStore.currentUserId);
    });
  } catch (e) {
    console.error("error fetching groups:", e);
  }
};

const selectGroup = (group: Group) => {
  selectedGroup.value = group;
  userRole.value = group.organizer === userStore.currentUserId ? "organizer" : "member";
};

onMounted(fetchGroups);
</script>

<template>
  <CreateGroup @group-created="fetchGroups" />
  <FetchGroupsByOrganizer @groups-fetched="groups = $event" />
  <GroupList :groups="groups" @group-selected="selectGroup" />
  <div v-if="selectedGroup">
    <ManageGroup :group="selectedGroup" :role="userRole" @group-updated="fetchGroups" />
  </div>
</template>

<style scoped>
div {
  margin-bottom: 1.5em;
}
</style>
