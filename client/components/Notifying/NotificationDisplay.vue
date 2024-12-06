<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { onBeforeMount, ref } from "vue";
import { NotifyingDoc } from "../../../server/concepts/notifying";

let notifications = ref<NotifyingDoc[]>([]);
let loaded = ref(false);

async function displayNotifications() {
  try {
    notifications.value = await fetchy(`/api/notifying/display`, "GET", { alert: false });
  } catch (e) {
    console.error(`Failed to fetch notifications: ${e}`);
  }
}

onBeforeMount(async () => {
  await displayNotifications();
  loaded.value = true;
});
</script>

<template>
  <h1>Your Notifications</h1>
  <div class="chat-container">
    <div v-for="(notif, index) in notifications" :key="index" :class="notif">
      <p>{{ notif.action.action }}</p>
      <p>{{ notif.message }}</p>
    </div>
  </div>
</template>

<style scoped>
.notif {
  background-color: blue !important; /* Color for sent messages */
  color: white; /* Text color for sent messages */
  align-self: flex-end; /* Align sent messages to the right */
  border-radius: 10px;
  margin: 0.5em;
  padding-left: 1em;
  padding-right: 1em;
}
</style>