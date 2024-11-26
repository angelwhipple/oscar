<!-- <script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { onMounted, ref } from "vue";

interface Group {
  _id: string;
  name: string;
  organizer: string;
  members: string[];
}

const groups = ref<Group[]>([]);
const groupName = ref("");
const duration = ref("");
const frequency = ref("");
const contribution = ref("");
const selectedGroup = ref<Group | null>(null);
const newMember = ref("");
const contributionAmount = ref("");
const withdrawalAmount = ref("");

const fetchGroups = async () => {
  try {
    groups.value = await fetchy("/api/groups", "GET");
  } catch (e) {
    console.error("error fetching groups:", e);
  }
};

const emptyForm = () => {
  groupName.value = "";
  duration.value = "";
  frequency.value = "";
  contribution.value = "";
  contributionAmount.value = "";
  withdrawalAmount.value = "";
};

const createGroup = async () => {
  try {
    await fetchy("/api/groups", "POST", {
      body: {
        name: groupName.value,
        duration: duration.value,
        freq: frequency.value,
        amt: contribution.value,
      },
    });
    fetchGroups();
    emptyForm();
  } catch (e) {
    console.error("error creating group:", e);
  }
};

const addMember = async () => {
  if (!selectedGroup.value) return;
  try {
    await fetchy(`/api/groups/members/add/${selectedGroup.value._id}`, "PATCH", {
      body: { user: newMember.value },
    });
    fetchGroups();
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
    fetchGroups();
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
    fetchGroups();
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
    fetchGroups();
    withdrawalAmount.value = "";
  } catch (e) {
    console.error("error withdrawing:", e);
  }
};

const selectGroup = (group: Group) => {
  selectedGroup.value = group;
};

onMounted(fetchGroups);
</script>

<template>
  <div>
    <h2>Create Group</h2>
    <form @submit.prevent="createGroup">
      <label for="groupName">Group Name:</label>
      <input id="groupName" v-model="groupName" required />
      <label for="duration">Cycle Duration (weeks):</label>
      <input id="duration" type="number" v-model="duration" required />
      <label for="frequency">Contribution Frequency (weeks):</label>
      <input id="frequency" type="number" v-model="frequency" required />
      <label for="contribution">Contribution Amount:</label>
      <input id="contribution" type="number" v-model="contribution" required />
      <button type="submit" class="pure-button-primary pure-button">Create Group</button>
    </form>

    <h2>Groups</h2>
    <ul class="group-list">
      <li v-for="group in groups" :key="group._id" class="group-item" @click="selectGroup(group)">
        <div class="group-circle">
          {{ group.name }}
        </div>
      </li>
    </ul>

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
  </div>
</template>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}

ul.group-list {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2em;
  list-style-type: none;
  padding: 0;
}

.group-item {
  cursor: pointer;
}

.group-circle {
  width: 120px;
  height: 120px;
  background-color: #7f7fad;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  text-align: center;
  font-weight: bold;
  transition:
    transform 0.3s,
    background-color 0.3s;
}

.group-circle:hover {
  transform: scale(1.1);
  background-color: #6b6b9a;
}

li:hover {
  background-color: transparent;
}

li {
  margin: 0.5em 0;
}
</style> -->

<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { onMounted, ref } from "vue";

interface Group {
  _id: string;
  name: string;
  organizer: string;
  members: string[];
}

const groups = ref<Group[]>([]);
const groupName = ref("");
const duration = ref("");
const frequency = ref("");
const contribution = ref("");
const selectedGroup = ref<Group | null>(null);
const newMember = ref("");
const contributionAmount = ref("");
const withdrawalAmount = ref("");

const fetchGroups = async () => {
  try {
    groups.value = await fetchy("/api/groups", "GET");
  } catch (e) {
    console.error("error fetching groups:", e);
  }
};

const emptyForm = () => {
  groupName.value = "";
  duration.value = "";
  frequency.value = "";
  contribution.value = "";
  contributionAmount.value = "";
  withdrawalAmount.value = "";
};

const createGroup = async () => {
  try {
    await fetchy("/api/groups", "POST", {
      body: {
        name: groupName.value,
        duration: duration.value,
        freq: frequency.value,
        amt: contribution.value,
      },
    });
    fetchGroups();
    emptyForm();
  } catch (e) {
    console.error("error creating group:", e);
  }
};

const addMember = async () => {
  if (!selectedGroup.value) return;
  try {
    await fetchy(`/api/groups/members/add/${selectedGroup.value._id}`, "PATCH", {
      body: { user: newMember.value },
    });
    fetchGroups();
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
    fetchGroups();
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
    fetchGroups();
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
    fetchGroups();
    withdrawalAmount.value = "";
  } catch (e) {
    console.error("error withdrawing:", e);
  }
};

const selectGroup = (group: Group) => {
  selectedGroup.value = group;
};

onMounted(fetchGroups);
</script>

<template>
  <div>
    <h2>Create Group</h2>
    <form @submit.prevent="createGroup" class="create-group-form">
      <div class="form-group">
        <label for="groupName">Group Name:</label>
        <input id="groupName" v-model="groupName" required />
      </div>
      <div class="form-group">
        <label for="duration">Cycle Duration (weeks):</label>
        <input id="duration" type="number" v-model="duration" required />
      </div>
      <div class="form-group">
        <label for="frequency">Contribution Frequency (weeks):</label>
        <input id="frequency" type="number" v-model="frequency" required />
      </div>
      <div class="form-group">
        <label for="contribution">Contribution Amount:</label>
        <input id="contribution" type="number" v-model="contribution" required />
      </div>
      <button type="submit" class="pure-button-primary pure-button">Create Group</button>
    </form>

    <h2>Groups</h2>
    <ul class="group-list">
      <li v-for="group in groups" :key="group._id" class="group-item" @click="selectGroup(group)">
        <div class="group-circle">
          {{ group.name }}
        </div>
      </li>
    </ul>

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
  </div>
</template>

<style scoped>
.create-group-form {
  display: flex;
  flex-direction: column;
  gap: 1em;
  background-color: #f9f9f9;
  padding: 2em;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  margin: 0 auto;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}
h2 {
  text-align: center;
}
label {
  font-weight: bold;
}

input {
  padding: 0.5em;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button {
  padding: 0.7em;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
}

button.pure-button-primary {
  background-color: #6b6b9a;
  color: white;
}

button.pure-button-primary:hover {
  background-color: #6b6b9a;
}

ul.group-list {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2em;
  list-style-type: none;
  padding: 0;
}

.group-item {
  cursor: pointer;
}

.group-circle {
  width: 120px;
  height: 120px;
  background-color: #6b6b9a;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  text-align: center;
  font-weight: bold;
  transition:
    transform 0.3s,
    background-color 0.3s;
}

.group-circle:hover {
  transform: scale(1.1);
  background-color: #6b6b9a;
}

li:hover {
  background-color: transparent;
}

li {
  margin: 0.5em 0;
}
</style>
