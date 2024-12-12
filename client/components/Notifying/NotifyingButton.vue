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
  invitees.value = props.group!.members;
  //angel will fix with groupStore
}

const setActionType = (type: string) => {
  actionType.value = type;
}

async function createNotif() {
  try {
    await fetchy(`/api/notifying`, "POST",
      { body: { recipients: invitees.value, message: notification.value, action: actionType.value } });
    setActionType("");
  } catch (e) {
    console.error(`Error creating notification: ${e}`);
  }
  reset();
}
</script>

<template>
  <div class="fetch-groups-container">
    <h2>Send a Group Notification</h2>
    <form @submit.prevent="createNotif" class="fetch-groups-form">
      <div class="form-actions">
        <button type="button" class="action-button" @click="setActionType('Payment')">Payment Reminder</button>
        <button type="button" class="action-button" @click="setActionType('SOS')">SOS</button>
      </div>
      <input v-if="actionType" class="input-field" v-model="notification" type="text" placeholder="Express your financial emergency" />
      <div class="action-container">
        <button v-if="actionType" @click="setActionType('')" class="fetch-button">Cancel</button>
        <button v-if="actionType === 'Payment'" type="submit" class="fetch-button">Send Reminder</button>
        <button v-else-if="actionType === 'SOS'" type="submit" id="sos-button">Send SOS</button>
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
  text-wrap: nowrap;
}

.fetch-groups-form {
  display: flex;
  flex-direction: column;
  gap: 1.5em;
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

.action-container {
  display: flex;
  justify-content: space-between;
}
</style>
