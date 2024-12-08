<script setup lang="ts">
import { defineProps, defineEmits, ref, onMounted } from "vue";
import { useGroupStore } from "@/stores/group";
import { useUserStore } from "@/stores/user";
import StyledButton from "@/components/Useful/StyledButton.vue";
import { GroupDoc, RequestDoc } from "../../../server/concepts/grouping";
import { UserDoc } from "../../../server/concepts/authenticating";

const props = defineProps(["requestId"])
const emit = defineEmits(["responded"]);
const groupStore = useGroupStore();
const userStore = useUserStore();

const request = ref<RequestDoc>();
const sender = ref<UserDoc>();
const group = ref<GroupDoc>()
const date = ref<Date>()

const accept = async () => {
  await groupStore.acceptRequest(props.requestId, (userStore.role === "member" ? "invite" : "request"));
  await groupStore.refreshGroups();
  emit("responded");
}

const decline = async () => {
  await groupStore.declineRequest(props.requestId);
  emit("responded");
}

const refreshRequest = async () => {
  request.value = await groupStore.fetchRequest(props.requestId);
  sender.value = await userStore.fetchUser(request.value!.sender.toString());
  date.value = new Date(request.value!.dateCreated);
  group.value = await groupStore.fetchGroup(request.value!.group.toString());
}

onMounted(refreshRequest);
</script>

<template>
  <section class="request-container">
    <h3>{{ group?.name }}</h3>
    <p class="opaque">
      {{ sender?.username }}
      {{ userStore.role === 'member' ? `invited you` : `requested to join` }}
      on {{ date?.toLocaleDateString() }}
    </p>
    <div class="actions">
      <StyledButton :on-click="accept">Accept</StyledButton>
      <StyledButton :on-click="decline">Decline</StyledButton>
    </div>
  </section>
</template>

<style scoped>
.request-container {
  height: fit-content;
  display: flex;
  flex-direction: column;
  border: 1px solid lightgray;
  border-radius: 1rem;
  padding: 2%;
  transition-duration: 0.3s;
}

.request-container:hover {
  box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.3);
}

.actions {
  display: flex;
  column-gap: 10px;
}
</style>