//Message View
<script setup lang="ts">
import MessageListComponent from "@/components/Messaging/MessageListComponent.vue"; //display all groups
import MessagingComponent from "@/components/Messaging/MessagingComponent.vue"; //display each messae
import SendingMessageComponent from "@/components/Messaging/SendingMessageComponent.vue"; //sends message
import { fetchy } from "@/utils/fetchy";
import { onBeforeMount, ref } from "vue";

const groups = ref<Array<{ _id: string; name: string }>>([]);
const selectedGroupId = ref<string | null>(null);
const messages = ref<Array<{ _id: string; content: string; sender: string }>>([]);
const loaded = ref(false);

async function fetchGroups() {
  try {
    groups.value = await fetchy("/api/groups", "GET");
  } catch (error) {
    console.error("Failed to fetch groups:", error);
    groups.value = [];
  }
}

async function fetchMessages(groupId: string) {
  try {
    loaded.value = false;
    messages.value = await fetchy(`/api/messages/group/${groupId}`, "GET");
  } catch (error) {
    console.error("Failed to fetch messages:", error);
    messages.value = [];
  } finally {
    loaded.value = true;
  }
}

function handleGroupSelection(groupId: string) {
  selectedGroupId.value = groupId;
  fetchMessages(groupId).catch((error) => {
    console.error("Failed to fetch messages after selecting group:", error);
  });
}

onBeforeMount(() => {
  fetchGroups().catch((error) => {
    console.error("Error in onBeforeMount while fetching groups:", error);
  });
});
</script>

<template>
  <section>
    <div class="main-container">
      <aside class="sidebar">
        <MessageListComponent :groups="groups" @selectGroup="handleGroupSelection" />
      </aside>
      <section class="messages-section">
        <h1>Messages</h1>
        <div v-if="!selectedGroupId" class="nonSelectedUserInterface">
          <h3>Please select a group to view messages</h3>
        </div>
        <div v-if="selectedGroupId">
          <section v-if="messages.length === 0 && loaded">
            <p>No messages in this group</p>
          </section>
          <section v-if="!loaded">
            <p>Loading messages...</p>
          </section>
          <div v-for="message in messages" :key="message._id" class="message-container">
            <MessagingComponent :message="message" @refreshMessages="fetchMessages(selectedGroupId)" />
          </div>
          <SendingMessageComponent :groupId="selectedGroupId" @refreshMessages="fetchMessages(selectedGroupId)" class="send-message" />
        </div>
      </section>
    </div>
  </section>
</template>

<style scoped>
.main-container {
  display: flex;
  height: calc(100vh - 80px);
}

.sidebar {
  width: 250px;
  background-color: var(--light-pastel-grey);
  border-right: 1px solid #ddd;
  height: 100%;
  overflow-y: auto;
}

.messages-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: var(--white);
  height: 100%;
}

.nonSelectedUserInterface {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.message-container {
  margin: 10px 0;
}

.send-message {
  position: fixed;
  bottom: 0;
  left: 250px;
  right: 0;
  background-color: var(--white);
  padding: 10px;
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
}
</style>
