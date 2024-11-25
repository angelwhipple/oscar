<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { ref } from "vue";

const selectedPermission = ref(""); // Tracks user selection
const userStore = useUserStore(); // Get the store instance
const { addMember, addOrganizer } = userStore; // Get the methods from the store

async function handleSubmit() {
  try {
    if (selectedPermission.value === "organizer") {
      await addOrganizer(); // Call the store method
      alert("You are now an organizer!");
    } else if (selectedPermission.value === "member") {
      await addMember(); // Call the store method
      alert("You are now a member!");
    } else {
      alert("Please select an option.");
    }
  } catch (error) {
    console.error("Error handling permission:", error);
    alert("Failed to update permissions.");
  }
}
</script>

<template>
  <form class="pure-form pure-form-aligned" @submit.prevent="handleSubmit">
    <h3>What would you like to do?</h3>
    <fieldset>
      <div class="pure-control-group">
        <label for="organizer">
          <input type="radio" id="organizer" value="organizer" v-model="selectedPermission" />
          Organize a ROSCA group
        </label>
      </div>
      <div class="pure-control-group">
        <label for="member">
          <input type="radio" id="member" value="member" v-model="selectedPermission" />
          Join a ROSCA group as a member
        </label>
      </div>
      <div class="pure-controls">
        <button type="submit" class="pure-button pure-button-primary">Submit</button>
      </div>
    </fieldset>
  </form>
</template>

<style scoped>
h3 {
  text-align: center;
  margin-bottom: 1rem;
}

.pure-control-group {
  margin-bottom: 1rem;
}
</style>
