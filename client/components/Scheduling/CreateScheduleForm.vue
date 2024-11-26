<!-- <script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const organizer = ref("");
const startDate = ref("");
const endDate = ref("");
const invitees = ref("");

const emit = defineEmits(["refreshSchedules"]);

const createSchedule = async () => {
  try {
    console.log("creating schedule:", organizer.value, startDate.value, endDate.value, invitees.value.split(","));
    await fetchy("/api/schedules", "POST", {
      body: { organizer: organizer.value, startDate: startDate.value, endDate: endDate.value, invitees: invitees.value.split(",") },
    });
  } catch (e) {
    console.log("error creating schedule:", e);
    return;
  }
  emit("refreshSchedules");
  emptyForm();
};

const emptyForm = () => {
  organizer.value = "";
  startDate.value = "";
  endDate.value = "";
  invitees.value = "";
};
</script>

<template>
  <form @submit.prevent="createSchedule">
    <label for="organizer">Organizer:</label>
    <input id="organizer" v-model="organizer" required />

    <label for="startDate">Start Date:</label>
    <input id="startDate" type="date" v-model="startDate" required />

    <label for="endDate">End Date:</label>
    <input id="endDate" type="date" v-model="endDate" required />

    <label for="invitees">Invitees (comma-separated IDs):</label>
    <input id="invitees" v-model="invitees" required />

    <button type="submit" class="pure-button-primary pure-button">Create Schedule</button>
  </form>
</template>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}
</style> -->

<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const organizer = ref("");
const startDate = ref("");
const endDate = ref("");
const invitees = ref("");

const emit = defineEmits(["refreshSchedules"]);

const createSchedule = async () => {
  const inviteeList = invitees.value.split(",").map((username) => username.trim());

  try {
    await fetchy("/api/meetings", "POST", {
      body: {
        organizer: organizer.value,
        startDate: startDate.value,
        endDate: endDate.value,
        invitees: inviteeList,
      },
    });
    emit("refreshSchedules");
    emptyForm();
  } catch (e) {
    console.error("error creating schedule:", e);
  }
};

const emptyForm = () => {
  organizer.value = "";
  startDate.value = "";
  endDate.value = "";
  invitees.value = "";
};
</script>

<template>
  <form @submit.prevent="createSchedule">
    <label for="organizer">Organizer:</label>
    <input id="organizer" v-model="organizer" required />
    <label for="startDate">Start Date:</label>
    <input id="startDate" type="date" v-model="startDate" required />
    <label for="endDate">End Date:</label>
    <input id="endDate" type="date" v-model="endDate" required />
    <label for="invitees">Invitees (comma-separated usernames):</label>
    <input id="invitees" v-model="invitees" required />
    <button type="submit" class="pure-button-primary pure-button">Create Schedule</button>
  </form>
</template>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}
</style>
