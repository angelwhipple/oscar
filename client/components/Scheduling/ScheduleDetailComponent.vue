<script setup lang="ts">
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
    schedule.value = await fetchy(`/api/meetings/${route.params.id}`, "GET");
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
    await fetchy(`/api/meetings/available/${route.params.id}`, "PUT", {
      body: { user, dates },
    });
    fetchSchedule();
  } catch (e) {
    console.log("error adding user availability:", e);
  }
};

const removeUserAvailability = async (user: string, dates: string[]) => {
  try {
    await fetchy(`/api/meetings/unavailable/${route.params.id}`, "PUT", {
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
</style>
