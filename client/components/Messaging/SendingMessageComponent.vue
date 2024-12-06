<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { ref } from "vue";

const messages = ref<Array<{ _id: string; content: string; sender: string }>>([]);
const props = defineProps(["groupId"]);
const emit = defineEmits(["refreshMessages"]);
const messageContent = ref("");

async function sendMessage() {
  if (!messageContent.value.trim()) return;
  try {
    await fetchy("/api/messages", "POST", {
      body: { group: props.groupId, content: messageContent.value },
    });
    messageContent.value = "";
    emit("refreshMessages");
  } catch (error) {
    console.error("Failed to send message:", error);
  }
}
</script>

<template>
  <div class="message-container">
    <textarea v-model="messageContent" placeholder="Enter your message" rows="3" class="message-textarea"></textarea>
    <button @click="sendMessage" class="send-button">Send</button>
  </div>
</template>

<style scoped>
textarea {
  width: 100%;
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
