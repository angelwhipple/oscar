<script setup lang="ts">
import { defineEmits, onBeforeMount, ref } from "vue";
import StyledButton from "@/components/Useful/StyledButton.vue";
import { useGroupStore } from "@/stores/group";
import { useUserStore } from "@/stores/user";
import Request from "@/components/Grouping/Request.vue";
import { RequestDoc } from "../../../server/concepts/grouping";
import { storeToRefs } from "pinia";

const emit = defineEmits(["stop-requesting"])
const groupStore = useGroupStore();
const userStore = useUserStore();

const requests = ref<RequestDoc[]>([])
const { currentUserId } = storeToRefs(userStore);

const cancelJoin = () => {
  emit("stop-requesting")
}

const refreshRequests = async () => {
  const invites: RequestDoc[] = await groupStore.getRequestsByUser(currentUserId.value);
  requests.value = invites.filter((invite) => invite.status === "pending");
}

onBeforeMount(refreshRequests);
</script>

<template>
  <body class="page">
    <p v-if="requests.length == 0" class="opaque">
      You haven't received any new {{ userStore.role == 'member' ? "invitations" : "requests" }}.
    </p>
    <div v-else class="invitation-scroll">
      <Request v-for="request in requests" :key="request._id.toString()" :requestId="request._id" @responded="refreshRequests"></Request>
    </div>
    <StyledButton :on-click="cancelJoin">
      Back
    </StyledButton>
  </body>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 20px;
}

.invitation-scroll {
  width: 75vw;
  height: 50vh;
  display: flex;
  flex-wrap: wrap;
  overflow-y: scroll;
  column-gap: 1.5rem;
  padding: 2%;
  justify-content: center;
}

.invitation-scroll::-webkit-scrollbar {
  display: none;
}
</style>