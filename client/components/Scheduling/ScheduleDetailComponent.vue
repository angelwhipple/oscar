<!-- <script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { fetchy } from "../../utils/fetchy";

const route = useRoute();
interface Schedule {
  organizer: string;
  availability: Record<string, string[]>;
}

const schedule = ref<Schedule | null>(null);

const fetchSchedule = async () => {
  try {
    schedule.value = await fetchy(`/api/schedules/${route.params.id}`, "GET");
    console.log("schedule:!!!!!!!!!!!!!!", schedule.value);
  } catch (e) {
    console.log("error fetching schedule:", e);
  }
};

onMounted(fetchSchedule);

interface UserAvailability {
  user: string;
  dates: string[];
}

const addUserAvailability = async (user: string, dates: string[]) => {
  try {
    const availability: UserAvailability = { user, dates };
    await fetchy(`/api/schedules/${route.params.id}/availability`, "POST", {
      body: JSON.stringify(availability),
    });
    fetchSchedule();
  } catch (e) {
    console.log("error adding user availability:", e);
  }
};

const removeUserAvailability = async (user: string, dates: string[]) => {
  try {
    await fetchy(`/api/schedules/${route.params.id}/availability`, "DELETE", {
      body: { user, dates },
    });
    fetchSchedule();
  } catch (e) {
    console.log("error removing user availability:", e);
  }
};
</script>

<template>
  <div v-if="schedule">
    <h2>{{ schedule.organizer }}'s Schedule</h2>
    <ul>
      <li v-for="(invitees, date) in schedule.availability" :key="date">{{ date }}: {{ invitees.join(", ") }}</li>
    </ul>
  </div>
</template>

<style scoped>
ul {
  list-style-type: none;
  padding: 0;
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
  const inviteeList = invitees.value.split(",").map((name) => name.trim());
  const body = JSON.stringify({
    organizer: organizer.value, // assuming organizer is entered as a username
    startDate: startDate.value,
    endDate: endDate.value,
    invitees: inviteeList,
  });

  try {
    await fetchy("/api/schedules", "POST", {
      headers: { "Content-Type": "application/json" },
      body: body,
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
    <label for="organizer">Organizer (username):</label>
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
