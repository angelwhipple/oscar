<script setup lang="ts">
import { useGroupStore } from "@/stores/group";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { defineEmits, defineProps, ref } from "vue";

import StyledButton from "@/components/Useful/StyledButton.vue";
import NotifyingButton from "../Notifying/NotifyingButton.vue";
import AddMember from "./AddMembers.vue";

const props = defineProps({ group: Object });
const emit = defineEmits(["group-updated", "clear-selected"]);
const userStore = useUserStore();
const groupStore = useGroupStore();

const renameGroupName = ref("");
const contributionAmount = ref("");
const withdrawalAmount = ref("");

const memberUsernames = ref<string[]>([]); //to hold user names of members

import { onMounted, watch } from "vue";

const balance = ref(0);

const fetchBalance = async () => {
  if (!props.group) return;
  const response = await fetchy(`/api/groups/balance/${props.group._id}`, "GET");
  balance.value = response.balance;
};

//fetch usernames of members
const fetchMemberUsernames = async () => {
  if (!props.group || !props.group.members) return;
  memberUsernames.value = await Promise.all(
    props.group.members.map(async (memberId: string) => {
      if (!memberId) return "";
      const response = await fetchy(`/api/users/id/${memberId}`, "GET");

      return response.username;
    }),
  );
};

// Fetch balance on component load
onMounted(() => {
  fetchBalance();
  fetchMemberUsernames();
});

// Watch for updates to the group and refetch balance
watch(
  () => props.group,
  () => {
    fetchBalance();
  },
);

const renameGroup = async () => {
  if (!props.group) return;
  await groupStore.renameGroup(props.group._id, renameGroupName.value);
  // Emit event to parent to fetch updated groups
  emit("group-updated");
  renameGroupName.value = "";
};

const contribute = async () => {
  try {
    if (!props.group) return;
    await fetchy(`/api/groups/transactions/contribute/${props.group._id}`, "PATCH", {
      body: { amount: contributionAmount.value },
    });
    contributionAmount.value = "";
    emit("group-updated");
    fetchBalance(); // Update balance
  } catch (e) {}
};

const withdraw = async () => {
  try {
    if (!props.group) return;
    await fetchy(`/api/groups/transactions/withdraw/${props.group._id}`, "PATCH", {
      body: { amount: withdrawalAmount.value },
    });
    withdrawalAmount.value = "";
    emit("group-updated");
    fetchBalance(); // Update balance
  } catch (e) {}
};

const clearSelectedGroup = () => {
  emit("clear-selected");
  fetchBalance();
};
</script>

<template>
  <body class="page">
    <div class="manage-group-container">
      <h3 class="group-title">Group: {{ group?.name }}</h3>

      <div class="balance-container">
        <!-- <h4>Current Balance :</h4> -->
        <p class="balance-circle">
          Current <br />
          Balance<br />
          <br />
          <strong> ${{ balance }}</strong>
        </p>
      </div>

      <div class="manage-section">
        <h4>Contribute</h4>
        <form @submit.prevent="contribute" class="manage-form">
          <label for="contributionAmount" class="form-label">Amount:</label>
          <input id="contributionAmount" type="number" v-model="contributionAmount" required class="input-field" />
          <button type="submit" class="action-button contribute-button">Contribute</button>
        </form>
      </div>

      <div class="manage-section" v-if="userStore.role === 'organizer'">
        <h4>Withdraw</h4>
        <form @submit.prevent="withdraw" class="manage-form">
          <label for="withdrawalAmount" class="form-label">Amount:</label>
          <input id="withdrawalAmount" type="number" v-model="withdrawalAmount" required class="input-field" />
          <button type="submit" class="action-button withdraw-button">Withdraw</button>
        </form>
      </div>
    </div>

    <!-- <div> -->
    <div class="manage-section" v-if="userStore.role === 'organizer'">
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
        <!-- <li v-for="member in group?.members" :key="member" class="member-item">
          {{ member }}
        </li> -->
        <li v-for="username in memberUsernames" :key="username" class="member-item">
          {{ username }}
        </li>
      </ul>
    </div>

    <AddMember v-if="userStore.role === 'organizer'" :groupId="props.group?._id" @member-added="emit('group-updated')" />
    <!-- </div> -->

    <NotifyingButton />

    <StyledButton :on-click="clearSelectedGroup"> Back </StyledButton>
  </body>
</template>

<style scoped>
.page {
  /* width: 100%; */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  row-gap: 20px;
}

.manage-group-container {
  width: 50%;
  margin: 0 auto;
  padding: 2.5em;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  background-color: #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  display: flex;
  flex-direction: column;
  align-items: center;
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
  flex-direction: row;
  gap: 0.25em;
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

.balance-container {
  flex: 2;
  display: flex;
  align-items: center;
  justify-content: center;
}

.balance-circle {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  align-items: center;
  /* height: 100px; */
  font-size: 20px;
  border: 1px solid #ccc;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #d9d9d9;
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
