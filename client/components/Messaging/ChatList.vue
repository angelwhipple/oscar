<script setup lang="ts">
import { useGroupStore } from "@/stores/group";
import { useUserStore } from "@/stores/user";
import { onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { GroupDoc } from "../../../server/concepts/grouping";

const emit = defineEmits(["selectGroup", "refreshMessages"]);

const { allGroups } = storeToRefs(useGroupStore());
const { currentUserId } = storeToRefs(useUserStore());
const groups = ref<GroupDoc[]>([]);
const selectedGroup = ref<string | null>(null);

async function refreshGroups() {
  groups.value = allGroups.value.filter((group) => {
    return group.members.some((member) => member.toString() === currentUserId.value.toString());
  })
}

function selectGroup(groupId: string) {
  selectedGroup.value = groupId;
  emit("selectGroup", groupId);
  emit("refreshMessages");
}

onMounted(refreshGroups);
</script>

<template>
  <div class="sidebar">
    <h2>Select Group</h2>
    <div class="group-container">
      <div class="group-block" v-for="group in groups" :key="group._id.toString()" @click="selectGroup(group._id.toString())" :class="{ selected: group._id.toString() === selectedGroup }">
        {{ group.name }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.sidebar {
  width: 20%;
  overflow-y: auto;
  padding: 20px;
}

.sidebar::-webkit-scrollbar {
  display: none;
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
