<script setup lang="ts">
import { useGroupStore } from "@/stores/group";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { defineEmits, defineProps, ref } from "vue";
import StyledButton from "@/components/Useful/StyledButton.vue";
import NotifyingButton from "../Notifying/NotifyingButton.vue";
import AddMember from "./AddMembers.vue";

const props = defineProps(["group"]);
const emit = defineEmits(["clear-selected"]);
const userStore = useUserStore();
const groupStore = useGroupStore();

const renameGroupName = ref("");
const contributionAmount = ref("");
const withdrawalAmount = ref("");

const draftedMembers = ref<string[]>([]);
const lotteryWinner = ref<string | null>(null);

const memberUsernames = ref<string[]>([]); //to hold user names of members

import { onMounted, watch } from "vue";

const balance = ref(0);
const amountPerContribution = ref(0);

const fetchBalance = async () => {
  if (!props.group) return;
  const response = await fetchy(`/api/groups/balance/${props.group._id}`, "GET", { alert: false });
  balance.value = response.balance;
};

const fetchMemberUsernames = async () => {
  if (!props.group || !props.group.members) return;
  memberUsernames.value = await Promise.all(
    props.group.members.map(async (memberId: string) => {
      if (!memberId) return "";
      const response = await fetchy(`/api/users/id/${memberId}`, "GET", { alert: false });
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
  renameGroupName.value = "";
};

const contribute = async () => {
  if (!props.group) return;
  await groupStore.makeContribution(props.group._id, contributionAmount.value);
  contributionAmount.value = "";
  await fetchBalance();
};

const withdraw = async () => {
  if (!props.group) return;
  await groupStore.makeWithdrawal(props.group._id, withdrawalAmount.value);
  withdrawalAmount.value = "";
  await fetchBalance(); // Update balance
};

const clearSelectedGroup = () => {
  emit("clear-selected");
};

const incrementBalance = async () => {
  try {
    if (!props.group) return;
    await fetchy(`/api/groups/transactions/contribute/${props.group._id}`, "PATCH", {
      body: { amount: amountPerContribution.value },
    });
    await fetchBalance(); // Update balance
  } catch (e) {}
};

// OPTIONAL FEATURES: //
const decrementBalance = async () => {
  try {
    if (!props.group) return;
    await fetchy(`/api/groups/transactions/withdraw/${props.group._id}`, "PATCH", {
      body: { amount: amountPerContribution.value },
    });
    await fetchBalance(); // Update balance
  } catch (e) {}
};

const generateLotteryWinner = () => {
  const eligibleMembers = memberUsernames.value.filter((username) => !draftedMembers.value.includes(username));

  if (eligibleMembers.length === 0) {
    draftedMembers.value = [];
    lotteryWinner.value = null;
    return;
  }

  const winner = eligibleMembers[Math.floor(Math.random() * eligibleMembers.length)];
  draftedMembers.value.push(winner);
  lotteryWinner.value = winner;
};
</script>

<template>
  <body class="page">
  <div class="manage-group-container">
    <h3 class="group-title">Name of Group: {{ group?.name }}</h3>

    <div class="layout">
      <!-- Left Section -->
      <div class="left-section">
        <h4>Group Members</h4>
        <ul class="member-list">
          <li v-for="username in memberUsernames" :key="username" class="member-item">
            <span>{{ username }}</span>
<!--            <div class="member-actions">-->
<!--              <button class="small-button">+</button>-->
<!--              <button class="small-button">-</button>-->
<!--            </div>-->
          </li>
        </ul>

<!--         <div class="reminder-section"> -->
<!--            <h4>Create Custom Reminder</h4>-->
<!--            <input type="text" placeholder="Enter Message" class="input-field" />-->
<!--            <button class="action-button">Send to All</button>-->
<!--         </div> -->

        <div class="sos-section">
          <NotifyingButton />
        </div>
      </div>

      <!-- Center Section -->
      <div class="center-section">
        <p class="balance-circle">
          Current <br />
          Balance<br />
          <br />
          <strong>${{ balance }}</strong>
        </p>
      </div>

      <!-- Right Section -->
      <div class="right-section">
        <button class="action-button" @click="generateLotteryWinner">Generate Lottery Winner</button>
        <p v-if="lotteryWinner">
          <strong class="winner">{{ lotteryWinner }} </strong> is the winner!
        </p>

        <div class="deadline-section">
          <h4>Deadline for Next Contribution</h4>
          <p>Dec 27, 2024</p>
        </div>

        <div class="add-user-section">
          <AddMember v-if="userStore.role === 'organizer'" :groupId="props.group?._id" />
        </div>
      </div>
    </div>

    <!-- Bottom Actions -->
    <div class="bottom-actions">
      <form @submit.prevent="contribute" class="inline-form">
        <button type="submit" class="action-button contribute-button">Contribute to Pot</button>
        <input type="number" v-model="contributionAmount" required placeholder="Enter Amount of Money" class="input-field" />
      </form>

      <form @submit.prevent="withdraw" class="inline-form">
        <button type="submit" class="action-button withdraw-button">Remove from Pot</button>
        <input type="number" v-model="withdrawalAmount" required placeholder="Enter Amount of Money" class="input-field" />
      </form>

      <StyledButton :on-click="clearSelectedGroup">Back</StyledButton>
    </div>
  </div>
  </body>
</template>

<style scoped>
.page {
  display: flex;
  justify-content: center;
  padding: 20px;
  background-color: #f5f7fa;
}

.manage-group-container {
  width: 100%;
  max-width: 1000px;
  padding: 20px;
  background-color: #ffffff;
  border: 1px solid #ddd;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.group-title {
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 20px;
  color: #2c3e50;
  text-align: center;
}

.layout {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  width: 100%;
}

.left-section,
.right-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.center-section {
  flex: 0 0 250px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.balance-circle {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  border: 3px solid #3498db;
  background-color: #ecf0f1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 1.2rem;
  color: #2980b9;
}

.reminder-section,
.sos-section,
.deadline-section,
.add-user-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.input-field {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
}

.action-button {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  color: white;
  background-color: #3498db;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.action-button:hover {
  background-color: #2980b9;
}

.bottom-actions {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}

.inline-form {
  display: flex;
  align-items: center;
  gap: 10px;
}

.member-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  row-gap: 0.2rem;
  height: 20vh;
  overflow-y: scroll;
}

.member-list::-webkit-scrollbar {
  display: none;
}

.member-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #ffffff;
}

.small-button {
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  font-size: 0.8rem;
  background-color: #ccc;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.small-button:hover {
  background-color: #aaa;
}

.winner {
  color: #27ae60;
}
</style>
