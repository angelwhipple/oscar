//Messaging Component
<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { onMounted, ref } from "vue";

const props = defineProps(["groupId"]);
const messages = ref<Array<{ _id: string; content: string; sender: string }>>([]);
const emit = defineEmits(["refreshMessages"]);
const error = ref<string | null>(null);

async function fetchMessages(): Promise<void> {
  try {
    messages.value = await fetchy(`/api/messages/group/${props.groupId}`, "GET");
  } catch (error) {
    console.error("Failed to fetch messages:", error);
    messages.value = [];
  }
}
async function deleteMessage(messageId: string): Promise<void> {
  try {
    await fetchy(`/api/messages/${messageId}`, "DELETE");
    await fetchMessages();
  } catch (error) {
    console.error("Failed to delete message:", error);
  }
}

onMounted(() => {
  fetchMessages().catch((error) => {
    console.error("Error in onMounted while fetching messages:", error);
  });
});
</script>

<template>
  <div>
    <h3>Messages</h3>
    <div v-for="message in messages" :key="message._id" class="message-item">
      <p>
        <strong>{{ message.sender }}</strong
        >: {{ message.content }}
      </p>
      <button class="delete-btn" @click="deleteMessage(message._id)">Delete</button>
    </div>
  </div>
</template>

<style scoped>
.message-item {
  margin-bottom: 10px;
}

.delete-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: red;
}
</style>
