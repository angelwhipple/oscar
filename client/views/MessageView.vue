<script setup lang="ts">
import ChatList from "@/components/Messaging/ChatList.vue";
import Message from "@/components/Messaging/Message.vue";
import { fetchy } from "@/utils/fetchy";
import { onBeforeMount, ref, watch } from "vue";
import { MessageDoc } from "../../server/concepts/messaging";

const selectedGroupId = ref<string | null>(null);
const messages = ref<MessageDoc[]>([]);
const messageContent = ref("");

async function handleGroupSelection(groupId: string) {
  selectedGroupId.value = groupId;
  await refreshMessages();
}

async function sendMessage() {
  if (!messageContent.value.trim()) return;
  try {
    await fetchy("/api/messages", "POST", {
      body: { group: selectedGroupId.value, content: messageContent.value }, alert: false,
    });
    await refreshMessages();
    messageContent.value = "";
  } catch (error) {
    console.error("Failed to send message:", error);
  }
}

const refreshMessages = async () => {
  if (!selectedGroupId.value) return;
  messages.value = await fetchy(`/api/messages/group/${selectedGroupId.value}`, "GET", { alert: false });
}

watch(selectedGroupId, refreshMessages);
onBeforeMount(refreshMessages);
</script>

<template>
  <section>
    <div class="main-container">
      <ChatList @selectGroup="handleGroupSelection" />
      <section class="messages-section">
        <h1>Messages</h1>
        <div v-if="!selectedGroupId" class="nonSelectedUserInterface">
          <h3>Please select a group to view messages</h3>
        </div>
        <div v-if="selectedGroupId">
          <section class="message-container">
            <p v-if="messages.length === 0">No messages to display.</p>
            <Message v-else v-for="message in messages" :key="message._id.toString()" :message="message" @refreshMessages="refreshMessages" />
          </section>
          <div class="message-box">
            <textarea v-model="messageContent" placeholder="Enter your message" rows="3" class="message-textarea"></textarea>
            <button @click="sendMessage" class="send-button">Send</button>
          </div>
        </div>
      </section>
    </div>
  </section>
</template>

<style scoped>
.main-container {
  display: flex;
  height: calc(100vh - 80px);
  width: 100%;
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
  width: 80%;
  padding: 2%;
}

.nonSelectedUserInterface {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.message-container {
  margin: 10px 0;
  height: 55vh;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
}

.message-container::-webkit-scrollbar {
  display: none;
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

.message-box {
  width: 100%;
}

textarea {
  width: inherit;
  padding: 10px;
  margin-bottom: 10px;
}

button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}
</style>
