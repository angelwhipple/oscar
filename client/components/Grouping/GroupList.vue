<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { computed, defineEmits, watch, ref, onMounted } from "vue";
import { useGroupStore } from "@/stores/group";
import { storeToRefs } from "pinia";
import StyledButton from "@/components/Useful/StyledButton.vue";

const emit = defineEmits(["selected-group", "create"]);
const userStore = useUserStore();
const groupStore = useGroupStore();
const { allGroups } = storeToRefs(groupStore);

const displayGroups = computed(() => {
  return allGroups.value.filter((group) => {
    return group.members.some((member) => member.toString() === userStore.currentUserId.toString())
  })
})

const select = (group: string) => {
  emit("selected-group", group);
};

const create = () => {
  emit("create")
}
</script>

<template>
  <div class="group-list-container">
    <h2>
      Groups
      {{ userStore.role === 'member' ? "(Member view)" : "(Organizer view)" }}
    </h2>
    <div class="group-list">
      <div
        v-if="displayGroups.length > 0"
        v-for="group in displayGroups"
        :key="group._id.toString()"
        class="group-item"
        @click="select(group._id.toString())"
        :class="{
          organizer: group.organizer.toString() === userStore.currentUserId.toString(),
          member: group.organizer.toString() !== userStore.currentUserId.toString() }"
      >
        <span class="group-name">{{ group.name }}</span>
      </div>
      <div v-else>
        <p class="opaque">You have no groups to display</p>
      </div>
    </div>
    <StyledButton v-if="userStore.role == 'organizer'" :on-click="create">
      Create a new group
    </StyledButton>
  </div>
</template>

<style scoped>

.group-list-container {
  text-align: center;
  padding: 2em;
}

.group-list {
  display: flex;
  justify-content: center;
  gap: 2em;
  flex-wrap: wrap;
  margin: 2em 0;
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
