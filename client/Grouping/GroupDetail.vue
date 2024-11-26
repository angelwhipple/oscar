<!-- <script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

interface Group {
  _id: string;
  name: string;
  members: string[];
}

const selectedGroup = ref<Group | null>(null);
const newMember = ref("");
const contributionAmount = ref("");
const withdrawalAmount = ref("");
const route = useRoute();

const fetchGroupDetails = async () => {
  try {
    const groupId = route.params.id as string;
    selectedGroup.value = await fetchy(`/api/groups/${groupId}`, "GET");
  } catch (e) {
    console.error("error fetching group details:", e);
  }
};

const addMember = async () => {
  if (!selectedGroup.value) return;
  try {
    await fetchy(`/api/groups/members/add/${selectedGroup.value._id}`, "PATCH", {
      body: { user: newMember.value },
    });
    fetchGroupDetails();
    newMember.value = "";
  } catch (e) {
    console.error("error adding member:", e);
  }
};

const removeMember = async (memberId: string) => {
  if (!selectedGroup.value) return;
  try {
    await fetchy(`/api/groups/members/remove/${selectedGroup.value._id}`, "PATCH", {
      body: { user: memberId },
    });
    fetchGroupDetails();
  } catch (e) {
    console.error("error removing member:", e);
  }
};

const contribute = async () => {
  if (!selectedGroup.value) return;
  try {
    await fetchy(`/api/groups/transactions/contribute/${selectedGroup.value._id}`, "PATCH", {
      body: { amount: contributionAmount.value },
    });
    fetchGroupDetails();
    contributionAmount.value = "";
  } catch (e) {
    console.error("error contributing:", e);
  }
};

const withdraw = async () => {
  if (!selectedGroup.value) return;
  try {
    await fetchy(`/api/groups/transactions/withdraw/${selectedGroup.value._id}`, "PATCH", {
      body: { amount: withdrawalAmount.value },
    });
    fetchGroupDetails();
    withdrawalAmount.value = "";
  } catch (e) {
    console.error("error withdrawing:", e);
  }
};

onMounted(fetchGroupDetails);
</script>

<template>
  <div v-if="selectedGroup">
    <h3>Manage Group: {{ selectedGroup.name }}</h3>
    <h4>Members</h4>
    <ul>
      <li v-for="member in selectedGroup.members" :key="member">
        {{ member }}
        <button @click="removeMember(member)">Remove</button>
      </li>
    </ul>
    <form @submit.prevent="addMember">
      <label for="newMember">Add Member (username):</label>
      <input id="newMember" v-model="newMember" required />
      <button type="submit" class="pure-button-primary pure-button">Add Member</button>
    </form>

    <h4>Contribute</h4>
    <form @submit.prevent="contribute">
      <label for="contributionAmount">Amount:</label>
      <input id="contributionAmount" type="number" v-model="contributionAmount" required />
      <button type="submit" class="pure-button-primary pure-button">Contribute</button>
    </form>

    <h4>Withdraw</h4>
    <form @submit.prevent="withdraw">
      <label for="withdrawalAmount">Amount:</label>
      <input id="withdrawalAmount" type="number" v-model="withdrawalAmount" required />
      <button type="submit" class="pure-button-primary pure-button">Withdraw</button>
    </form>
  </div>
</template> -->
