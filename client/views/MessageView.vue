<script setup lang="ts">
import MessageListComponent from "@/components/Messaging/MessageListComponent.vue";
import MessageComponent from "@/components/Messaging/MessagingComponent.vue";
import SendingMessageComponent from "@/components/Messaging/SendingMessageComponent.vue";
import { fetchy } from "@/utils/fetchy";
import { ref } from "vue";

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
    loaded.value = false; // Indicate loading
    const response = await fetchy(`/api/messages/group/${groupId}`, "GET");
    messages.value = response; // Update messages list
  } catch (error) {
    console.error("Failed to fetch messages:", error);
    messages.value = []; // Clear messages on error
  } finally {
    loaded.value = true; // Loading complete
  }
}

function handleGroupSelection(groupId: string) {
  selectedGroupId.value = groupId; // Update the selected group
  fetchMessages(groupId).catch((error) => {
    console.error("Failed to fetch messages after selecting group:", error);
  });
}

// Fetch groups on component mount
fetchGroups().catch((error) => {
  console.error("Error in onBeforeMount while fetching groups:", error);
});
</script>

<template>
  <section>
    <div class="main-container">
      <aside class="sidebar">
        <!-- Message List Component -->
        <MessageListComponent :groups="groups" @selectGroup="handleGroupSelection" />
      </aside>

      <section class="messages-section">
        <h1>Messages</h1>

        <!-- Show a message if no group is selected -->
        <div v-if="!selectedGroupId" class="nonSelectedUserInterface">
          <h3>Please select a group to view messages</h3>
        </div>

        <!-- Show messages and send message form if a group is selected -->
        <div v-if="selectedGroupId">
          <section v-if="messages.length === 0 && loaded">
            <p>No messages in this group</p>
          </section>
          <section v-if="!loaded">
            <p>Loading messages...</p>
          </section>
          <article v-for="message in messages" :key="message._id">
            <MessageComponent :groupId="selectedGroupId" :message="message" />
          </article>
          <SendingMessageComponent :groupId="selectedGroupId" @refreshMessages="fetchMessages(selectedGroupId)" />
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
