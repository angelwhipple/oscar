<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { onMounted, ref, watch } from "vue";

const props = defineProps<{
  groupId: string;
  message: { _id: string; content: string; sender: string };
}>();
const messages = ref<Array<{ _id: string; content: string; sender: string }>>([]);
const emit = defineEmits(["refreshMessages"]);
const error = ref<string | null>(null);
const loaded = ref(false);

async function fetchMessages(groupId: string) {
  loaded.value = false;
  try {
    const response = await fetchy(`/api/messages/group/${groupId}`, "GET");
    messages.value = response;
    error.value = null;
  } catch (err) {
    console.error("Failed to load");
  } finally {
    loaded.value = true;
  }
}

onMounted(() => {
  fetchMessages(props.groupId).catch((err) => {
    console.error("Error in onMounted while fetching messages:", err);
  });
});

watch(
  () => props.groupId,
  (newGroupId) => {
    fetchMessages(newGroupId).catch((err) => {
      console.error("Error while watching groupId changes:", err);
    });
  },
);
</script>

<template>
  <div>
    <h3>Messages</h3>
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
    <div v-if="!loaded && !error" class="loading-message">Loading messages...</div>
    <div v-else>
      <div v-if="messages.length === 0" class="no-messages">No messages in this group.</div>
      <div v-for="message in messages" :key="message._id" class="message-item">
        <p>
          <strong>{{ message.sender }}</strong
          >: {{ message.content }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.message-item {
  margin-bottom: 10px;
  padding: 5px;
  border-bottom: 1px solid #ddd;
}

.delete-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: red;
  font-weight: bold;
}

.error-message {
  color: red;
  font-size: 14px;
  margin-bottom: 10px;
}

.loading-message {
  color: #888;
  font-size: 14px;
  margin-bottom: 10px;
}

.no-messages {
  color: #555;
  font-size: 14px;
  margin-bottom: 10px;
}
</style>
