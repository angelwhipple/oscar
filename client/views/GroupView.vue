<script setup lang="ts">
import { useGroupStore } from "@/stores/group";
import { useUserStore } from "@/stores/user";
import { ref } from "vue";
import { GroupDoc } from "../../server/concepts/grouping";
import CreateGroup from "../components/Grouping/CreateGroup.vue";
import FetchGroupsByOrganizer from "../components/Grouping/FetchGroupByOrganizer.vue";
import GroupDetails from "../components/Grouping/GroupDetails.vue";
import GroupList from "../components/Grouping/GroupList.vue";

const groupStore = useGroupStore();
const userStore = useUserStore();

const selectedGroup = ref<GroupDoc | null>();
const isCreating = ref(false);

const selectGroup = async (groupId: string) => {
  selectedGroup.value = groupId ? await groupStore.fetchGroup(groupId) : null;
};

const setIsCreating = (value: boolean) => {
  isCreating.value = value;
};

const clearSelected = () => {
  selectedGroup.value = null;
};
</script>

<template>
  <div v-if="selectedGroup">
    <GroupDetails :group="selectedGroup" @group-updated="groupStore.refreshGroups" @clear-selected="clearSelected" />
  </div>
  <div v-else>
    <CreateGroup v-if="isCreating && userStore.role === 'organizer'" @group-created="setIsCreating(false)" @cancel="setIsCreating(false)" />
    <div v-else>
      <GroupList @selected-group="selectGroup" @create="setIsCreating(true)" />
      <FetchGroupsByOrganizer v-if="userStore.role === 'member'" />
    </div>
  </div>
</template>

<style scoped>
div {
  margin-bottom: 1.5em;
}
</style>
