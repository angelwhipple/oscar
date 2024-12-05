<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { ref } from "vue";

const notification = ref("");
const invitees = ref<string[]>([]);
let actionType = ref("");

const props = defineProps({
  group: Object, //has id, name, organiser, and member
});

const reset = () => {
  notification.value = "";
};

async function getGroupMembers() {
  invitees.value = props.group.members;
  //angel will fix with groupStore
}

const reminderAction = () => {
  actionType.value = "Reminder";
};

const SOSAction = () => {
  actionType.value = "SOS";
};

const PaymentAction = () => {
  actionType.value = "Payment";
};

//changing no
async function createNotif() {
  try {
    await fetchy(`/api/notifying/`, "POST", { body: { recipients: invitees.value, message: notification.value, action: actionType.value } });
  } catch (e) {
    console.error("error fetching group", e);
  }
  console.log("notification created!");
  reset();
}
</script>

<!-- need to redesign layout to include more information about the type of notification... -->
<!-- include v-if's for different type -->

<template>
  <div class="fetch-groups-container">
    <h2>Create a Notification for the Group</h2>
    <form @submit.prevent="createNotif" class="fetch-groups-form">
      <div class="form-actions">
        <button type="button" class="action-button" @click.prevent="reminderAction">Reminder</button>
        <button type="button" class="action-button" @click.prevent="SOSAction">SOS</button>
        <button type="button" class="action-button" @click.prevent="PaymentAction">Payment</button>
      </div>
      <div v-if="actionType === 'Reminder'">
        <input class="input-field" v-model="notification" type="text" placeholder="Write Reminder Message" />
        <button type="submit" class="fetch-button">Send Reminder</button>
      </div>
      <div v-if="actionType === 'SOS'">
        <input class="input-field" v-model="notification" type="text" placeholder="Write SOS Message" />
        <button type="submit" id="sos-button">Send SOS</button>
      </div>
      <div v-if="actionType === 'Payment'">
        <input class="input-field" v-model="notification" type="text" placeholder="Submit Payment" />
        <button type="submit" class="fetch-button">Send Payment</button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.fetch-groups-container {
  max-width: 500px;
  margin: 0 auto;
  padding: 2em;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  background-color: #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.fetch-groups-form {
  display: flex;
  flex-direction: column;
  gap: 1.5em;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.input-field {
  padding: 0.75em;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  width: 90%;
  margin-bottom: 1em;
}

.input-field:focus {
  border-color: #007bff;
  outline: none;
}

.form-actions {
  display: flex;
  justify-content: flex-start;
  margin-top: 1em;
}

.action-button {
  background-color: #000000;
  color: #fff;
  border: none;
  padding: 0.75em 1.5em;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
  margin: 0.5em;
}

#sos-button {
  background-color: red;
  color: #fff;
  border: none;
  padding: 0.75em 1.5em;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
  margin: 0.5em;
}

.fetch-button {
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 0.75em 1.5em;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
  margin: 0.5em;
}

.fetch-button:hover {
  background-color: #0056b3;
}
</style>
