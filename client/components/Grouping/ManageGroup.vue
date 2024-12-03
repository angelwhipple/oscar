<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { defineEmits, defineProps, ref } from "vue";
import NotifyingButton from "../Notifying/NotifyingButton.vue";
import AddMember from "./AddMembers.vue";

const props = defineProps({
  group: Object, //has id, name, organiser, and member
});

const emit = defineEmits(["group-updated"]);

const renameGroupName = ref("");
const contributionAmount = ref("");
const withdrawalAmount = ref("");

const renameGroup = async () => {
  try {
    if (!props.group) return;
    await fetchy(`/api/groups/rename/${props.group._id}`, "PATCH", {
      body: { name: renameGroupName.value },
    });
    renameGroupName.value = "";
    // Emit event to parent to fetch updated groups
    emit("group-updated");
  } catch (e) {
    console.error("error renaming group:", e);
  }
};

const contribute = async () => {
  try {
    if (!props.group) return;
    await fetchy(`/api/groups/transactions/contribute/${props.group._id}`, "PATCH", {
      body: { amount: contributionAmount.value },
    });
    contributionAmount.value = "";
    emit("group-updated");
  } catch (e) {
    console.error("error contributing:", e);
  }
};

const withdraw = async () => {
  try {
    if (!props.group) return;
    await fetchy(`/api/groups/transactions/withdraw/${props.group._id}`, "PATCH", {
      body: { amount: withdrawalAmount.value },
    });
    withdrawalAmount.value = "";
    emit("group-updated");
  } catch (e) {
    console.error("error withdrawing:", e);
  }
};
</script>

<template>
  <div class="manage-group-container">
    <h3 class="group-title">Manage Group: {{ group?.name }}</h3>

    <div class="manage-section">
      <h4>Rename Group</h4>
      <form @submit.prevent="renameGroup" class="manage-form">
        <label for="renameGroupName" class="form-label">New Group Name:</label>
        <input id="renameGroupName" v-model="renameGroupName" required class="input-field" />
        <button type="submit" class="action-button rename-button">Rename Group</button>
      </form>
    </div>

    <div class="manage-section">
      <h4>Members</h4>
      <ul class="member-list">
        <li v-for="member in group?.members" :key="member" class="member-item">
          {{ member }}
        </li>
      </ul>
    </div>

    <AddMember :groupId="group?._id" @member-added="emit('group-updated')" />

    <div class="manage-section">
      <h4>Contribute</h4>
      <form @submit.prevent="contribute" class="manage-form">
        <label for="contributionAmount" class="form-label">Amount:</label>
        <input id="contributionAmount" type="number" v-model="contributionAmount" required class="input-field" />
        <button type="submit" class="action-button contribute-button">Contribute</button>
      </form>
    </div>

    <div class="manage-section">
      <h4>Withdraw</h4>
      <form @submit.prevent="withdraw" class="manage-form">
        <label for="withdrawalAmount" class="form-label">Amount:</label>
        <input id="withdrawalAmount" type="number" v-model="withdrawalAmount" required class="input-field" />
        <button type="submit" class="action-button withdraw-button">Withdraw</button>
      </form>
    </div>
  </div>
  <NotifyingButton :group="group" />
</template>

<style scoped>
.manage-group-container {
  max-width: 700px;
  margin: 0 auto;
  padding: 2.5em;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  background-color: #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.group-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1.5em;
  color: #333;
}

.manage-section {
  margin-bottom: 2em;
}

.manage-form {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

.form-label {
  font-weight: bold;
  margin-bottom: 0.5em;
}

.input-field {
  padding: 0.75em;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.input-field:focus {
  border-color: #007bff;
  outline: none;
}

.action-button {
  padding: 0.75em 1.5em;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  color: #fff;
}

.rename-button {
  background-color: #007bff;
}

.rename-button:hover {
  background-color: #0056b3;
}

.remove-button {
  background-color: #dc3545;
  padding: 0.5em 1em;
  margin-left: 1em;
}

.remove-button:hover {
  background-color: #c82333;
}

.contribute-button {
  background-color: #28a745;
}

.contribute-button:hover {
  background-color: #218838;
}

.withdraw-button {
  background-color: #ffc107;
}

.withdraw-button:hover {
  background-color: #e0a800;
}

.member-list {
  list-style-type: none;
  padding: 0;
}

.member-item {
  display: flex;
  align-items: center;
  margin: 0.75em 0;
  padding: 0.75em;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  transition: background-color 0.3s ease;
}

.member-item:hover {
  background-color: #f9f9f9;
}
</style>
