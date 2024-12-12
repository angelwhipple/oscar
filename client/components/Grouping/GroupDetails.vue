<script setup lang="ts">
import { useGroupStore } from "@/stores/group";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { defineEmits, defineProps, ref, onMounted, watch } from "vue";
import StyledButton from "@/components/Useful/StyledButton.vue";
import NotifyingButton from "../Notifying/NotifyingButton.vue";
import AddMember from "./AddMembers.vue";

const props = defineProps(["group"]);
const emit = defineEmits(["clear-selected"]);
const userStore = useUserStore();
const groupStore = useGroupStore();

const renameGroupName = ref("");
const contributionAmount = ref(0);
const withdrawalAmount = ref(0);
const balance = ref(0);
const amountPerContribution = ref(0);
const isViewingLottery = ref(false);

const ineligibleMembers = ref<string[]>([]);
const lotteryWinner = ref<string | null>(null);
const memberUsernames = ref<string[]>([]);

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

onMounted(() => {
  fetchBalance();
  fetchMemberUsernames();
});

watch(props.group, () => {
    fetchBalance();
});

const renameGroup = async () => {
  if (!props.group) return;
  await groupStore.renameGroup(props.group._id, renameGroupName.value);
  renameGroupName.value = "";
};

const contribute = async () => {
  if (!props.group) return;
  await groupStore.makeContribution(props.group._id, contributionAmount.value);
  contributionAmount.value = 0;
  await fetchBalance();
};

const withdraw = async () => {
  if (!props.group) return;
  await groupStore.makeWithdrawal(props.group._id, withdrawalAmount.value);
  withdrawalAmount.value = 0;
  await fetchBalance();
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
  const eligibleMembers = memberUsernames.value.filter((username) => !ineligibleMembers.value.includes(username));
  if (!eligibleMembers) {
    lotteryWinner.value = null;
    return;
  }
  lotteryWinner.value = eligibleMembers[Math.floor(Math.random() * eligibleMembers.length)];
  isViewingLottery.value = true;
};

const disbursePotToWinner = async () => {
  ineligibleMembers.value.push(lotteryWinner.value!);
  withdrawalAmount.value = balance.value;
  await withdraw();
  isViewingLottery.value = false;
  lotteryWinner.value = null;
}

const endLottery = () => {
  lotteryWinner.value = null;
  isViewingLottery.value = false;
}

const restartCycle = () => {
  ineligibleMembers.value = []
  isViewingLottery.value = false;
}
</script>

<template>
  <body class="page">
  <section v-if="isViewingLottery" class="modal centered">
    <div class="content">
      <p v-if="lotteryWinner"><strong class="winner">{{ lotteryWinner }}</strong> wins the ROSCA pot this round.</p>
      <p v-else>Everyone has received the pot this cycle. Restart ROSCA?</p>
      <div class="bottom-actions">
        <StyledButton :on-click="endLottery">
          Cancel
        </StyledButton>
        <StyledButton v-if="lotteryWinner" :on-click="disbursePotToWinner">
          Disburse winnings
        </StyledButton>
        <StyledButton v-else :on-click="restartCycle">
          New cycle
        </StyledButton>
      </div>
    </div>
  </section>
  <div class="manage-group-container">
    <h3 class="group-title">{{ group?.name }}</h3>

    <div class="layout">
      <!-- Left Section -->
      <div class="left-section">
        <h4>Group Members</h4>
        <ul class="member-list">
          <li v-for="username in memberUsernames" :key="username" class="member-item">
            <span>{{ username }}</span>
          </li>
        </ul>
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
        <button v-if="userStore.currentUserId === props.group.organizer" class="action-button" @click="generateLotteryWinner">Issue Payout</button>
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
        <input type="number" v-model="contributionAmount" required placeholder="Enter $ amount" min="1" class="input-field" />
      </form>

      <form @submit.prevent="withdraw" class="inline-form">
        <button type="submit" class="action-button withdraw-button">Remove from Pot</button>
        <input type="number" v-model="withdrawalAmount" required placeholder="Enter $ amount" min="1" class="input-field" />
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

.winner {
  color: #27ae60;
}

.modal .content {
  position: absolute;
  background-color: white;
  width: 40%;
  height: 40%;
  animation: fadeIn 0.3s;
  border-radius: 1em;
  overflow-y: scroll;
}

.modal .content::-webkit-scrollbar {
  display: none;
}
</style>
