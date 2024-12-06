<script setup lang="ts">
import { defineProps, defineEmits, ref, onMounted } from "vue";
import { useGroupStore } from "@/stores/group";
import StyledButton from "@/components/Useful/StyledButton.vue";
import { GroupDoc, InvitationDoc } from "../../../server/concepts/grouping";

const props = defineProps(["invitationId"])
const emit = defineEmits(["responded"]);
const groupStore = useGroupStore();

const invitation = ref<InvitationDoc>();
const group = ref<GroupDoc>()
const date = ref<Date>()

const accept = async () => {
  await groupStore.acceptInvitation(props.invitationId);
  await groupStore.refreshGroups();
  emit("responded");
}

const decline = async () => {
  await groupStore.declineInvitation(props.invitationId);
  emit("responded");
}

const refreshInvitation = async () => {
  invitation.value = await groupStore.fetchInvitation(props.invitationId);
  date.value = new Date(invitation.value!.dateCreated);
  group.value = await groupStore.fetchGroup(invitation.value!.group.toString());
}

onMounted(refreshInvitation);
</script>

<template>
  <section class="invitation-container">
    <h3>{{ group?.name }}</h3>
    <p class="opaque">Invited on {{ date?.toLocaleDateString() }}</p>
    <div class="actions">
      <StyledButton :on-click="accept">Accept</StyledButton>
      <StyledButton :on-click="decline">Decline</StyledButton>
    </div>
  </section>
</template>

<style scoped>
.invitation-container {
  height: fit-content;
  display: flex;
  flex-direction: column;
  border: 1px solid lightgray;
  border-radius: 1rem;
  padding: 2%;
  transition-duration: 0.3s;
}

.invitation-container:hover {
  box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.3);
}

.actions {
  display: flex;
  column-gap: 10px;
}
</style>