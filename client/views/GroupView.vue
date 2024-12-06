<script setup lang="ts">
import { useGroupStore } from "@/stores/group";
import { useUserStore } from "@/stores/user";
import { ref } from "vue";
import { GroupDoc } from "../../server/concepts/grouping";
import CreateGroup from "../components/Grouping/CreateGroup.vue";
import FetchGroupsByOrganizer from "../components/Grouping/FetchGroupByOrganizer.vue";
import GroupDetails from "../components/Grouping/GroupDetails.vue";
import GroupList from "../components/Grouping/GroupList.vue";
import InvitationList from "@/components/Grouping/InvitationList.vue";

const groupStore = useGroupStore();
const userStore = useUserStore();

const selectedGroup = ref<GroupDoc | null>();
const isCreating = ref(false);
const isJoining = ref(false);

const selectGroup = async (groupId: string | null) => {
  selectedGroup.value = groupId ? await groupStore.fetchGroup(groupId) : null;
};

const setIsCreating = (value: boolean) => {
  isCreating.value = value;
};

const setIsJoining = (value: boolean) => {
  isJoining.value = value;
}
</script>

<template>
  <GroupDetails
    v-if="selectedGroup"
    :group="selectedGroup"
    @clear-selected="selectGroup(null)"
  />
  <CreateGroup
    v-else-if="isCreating && userStore.role === 'organizer'"
    @cancel-create="setIsCreating(false)"
  />
  <InvitationList v-else-if="isJoining && userStore.role === 'member'" @cancel-join="setIsJoining(false)"></InvitationList>
  <div v-else>
    <GroupList @selected-group="selectGroup" @create="setIsCreating(true)" @join="setIsJoining(true)" />
    <FetchGroupsByOrganizer v-if="userStore.role === 'member'" :groupId="selectedGroup" />
  </div>
</template>

<style scoped>
div {
  margin-bottom: 1.5em;
}
</style>
