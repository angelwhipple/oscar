//Messaging Component
<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { onBeforeMount, ref } from "vue";
import { useUserStore } from "@/stores/user";

const props = defineProps(["message"])
const emit = defineEmits(["refreshMessages"]);
const userStore = useUserStore();

const username = ref("")

async function deleteMessage(messageId: string): Promise<void> {
  try {
    await fetchy(`/api/messages/${messageId}`, "DELETE");
    emit("refreshMessages");
  } catch (error) {
    console.error("Failed to delete message:", error);
  }
}

const refreshUsername = async () => {
  const user = await userStore.fetchUser(props.message.sender.toString());
  username.value = user.username;
}

onBeforeMount(refreshUsername)
</script>

<template>
  <div class="message-item">
    <p>
      <strong>{{ username }}</strong
      >: {{ props.message.content }}
    </p>
    <button class="delete-btn" @click="deleteMessage(props.message._id)">Delete</button>
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
