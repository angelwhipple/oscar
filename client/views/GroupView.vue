<script setup lang="ts">
import { useGroupStore } from "@/stores/group";
import { useUserStore } from "@/stores/user";
import { computed, ref } from "vue";
import { GroupDoc } from "../../server/concepts/grouping";
import CreateGroup from "../components/Grouping/CreateGroup.vue";
import DiscoverGroups from "../components/Grouping/DiscoverGroups.vue";
import GroupDetails from "../components/Grouping/GroupDetails.vue";
import GroupList from "../components/Grouping/GroupList.vue";
import RequestList from "@/components/Grouping/RequestList.vue";
import StyledButton from "@/components/Useful/StyledButton.vue";
import { storeToRefs } from "pinia";

const groupStore = useGroupStore();
const userStore = useUserStore();
const { allGroups } = storeToRefs(groupStore);

const selectedGroup = ref<GroupDoc | null>();
const isCreating = ref(false);
const isRequesting = ref(false);
const isDiscovering = ref(false);

const displayGroups = computed(() => {
  return allGroups.value.filter((group) => {
    return group.members.some((member) => member.toString() === userStore.currentUserId.toString())
  })
})

const selectGroup = async (groupId: string | null) => {
  selectedGroup.value = groupId ? await groupStore.fetchGroup(groupId) : null;
};

const toggleIsCreating = () => {
  isCreating.value = !isCreating.value;
}

const toggleIsRequesting = () => {
  isRequesting.value = !isRequesting.value;
}

const toggleIsDiscovering = () => {
  isDiscovering.value = !isDiscovering.value;
}
</script>

<template>
  <h1 v-if="isRequesting">
    {{ userStore.role == 'member' ? "Group Invitations" : "Group Requests" }}
  </h1>
  <h1 v-else-if="isDiscovering">Discover</h1>
  <h1 v-else-if="isCreating">Create a Group</h1>
  <h1 v-else>ROSCA Groups</h1>
  <GroupDetails
    v-if="selectedGroup"
    :group="selectedGroup"
    @clear-selected="selectGroup(null)"
  />
  <CreateGroup
    v-else-if="isCreating && userStore.role === 'organizer'"
    @cancel-create="toggleIsCreating"
  />
  <DiscoverGroups v-else-if="isDiscovering && userStore.role === 'member'" @cancel-discover="toggleIsDiscovering" />
  <RequestList v-else-if="isRequesting" @stop-requesting="toggleIsRequesting" />
  <div v-else>
    <h2>My Groups</h2>
    <GroupList
      :groups="displayGroups"
      @selected-group="selectGroup" />
    <div class="action-container">
      <StyledButton :on-click="toggleIsRequesting">
        View {{ userStore.role == 'member' ? "invitations" : "requests" }}
      </StyledButton>
      <StyledButton v-if="userStore.role == 'organizer'" :on-click="toggleIsCreating">
        Create a new group
      </StyledButton>
      <StyledButton v-else :on-click="toggleIsDiscovering">
        Discover groups
      </StyledButton>
    </div>
  </div>
</template>

<style scoped>
div {
  margin-bottom: 1.5em;
}

h1, h2 {
  text-align: center;
}

.action-container {
  display: flex;
  justify-content: center;
  column-gap: 1em;
}
</style>
