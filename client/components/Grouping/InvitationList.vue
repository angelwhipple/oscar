<script setup lang="ts">
import { defineEmits, onBeforeMount, ref } from "vue";
import StyledButton from "@/components/Useful/StyledButton.vue";
import { useGroupStore } from "@/stores/group";
import { useUserStore } from "@/stores/user";
import Invitation from "@/components/Grouping/Invitation.vue";
import { InvitationDoc } from "../../../server/concepts/grouping";
import { storeToRefs } from "pinia";

const emit = defineEmits(["cancel-join"])
const groupStore = useGroupStore();

const invitations = ref<InvitationDoc[]>([])
const { currentUserId } = storeToRefs(useUserStore());

const cancelJoin = () => {
  emit("cancel-join")
}

const refreshInvitations = async () => {
  const invites: InvitationDoc[] = await groupStore.getInvitationsByUser(currentUserId.value);
  invitations.value = invites.filter((invite) => invite.status === "pending");
}

onBeforeMount(refreshInvitations);
</script>

<template>
  <body class="page">
    <p class="opaque">View your group invitations here</p>
    <div class="invitation-scroll">
      <Invitation v-for="invite in invitations" :key="invite._id.toString()" :invitationId="invite._id" @responded="refreshInvitations"></Invitation>
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