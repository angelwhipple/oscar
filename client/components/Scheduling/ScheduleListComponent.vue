<script setup lang="ts">
import { onMounted, ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const schedules = ref([]);

const fetchSchedules = async () => {
  schedules.value = await fetchy("/api/schedules", "GET");
};

onMounted(fetchSchedules);
</script>

<template>
  <div>
    <h2>Schedules</h2>
    <ul>
      <li v-for="schedule in schedules" :key="schedule._id">
        <RouterLink :to="{ name: 'ScheduleDetail', params: { id: schedule._id } }"> {{ schedule.organizer }}'s Schedule </RouterLink>
      </li>
    </ul>
  </div>
</template>

<style scoped>
ul {
  list-style-type: none;
  padding: 0;
}
</style>
