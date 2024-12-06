import { defineStore } from "pinia";
import { computed, ref } from "vue";

import { fetchy } from "@/utils/fetchy";
import { GroupDoc } from "../../server/concepts/grouping";

export const useGroupStore = defineStore(
  "group",
  () => {
    const allGroups = ref<GroupDoc[]>([]);
    const activeGroup = ref<GroupDoc | undefined>();

    const refreshGroups = async () => {
      allGroups.value = await fetchy("/api/groups", "GET", { alert: false });
    }

    const setActiveGroup = async (id: string) => {
      activeGroup.value = id ? await fetchGroup(id) : null;
    }

    const fetchGroup = async (id: string) => {
      return await fetchy(`/api/groups/${id}`, "GET", { alert: false });
    }

    const filterGroupsByOrganizer = async (organizer: string) => {
      try {
        allGroups.value = await fetchy(`/api/groups/organizer/${organizer}`, "GET", { alert: false });
      } catch (error) {
        console.error(`Failed to fetch groups by organizer: ${error}`);
      }
    }

    const createGroup = async (name: string, rules: string, frequency: number, contribution: number) => {
      try {
        return await fetchy("/api/groups", "POST", {
          body: { name, rules, frequency, contribution },
        });
      } catch (e) {
        console.error(`Error creating group: ${e}`);
        return { error: e }
      }
    }

    const renameGroup = async (id: string, name: string) => {
      try {
        await fetchy(`/api/groups/rename/${id}`, "PATCH", {
          body: { name: name }, alert: false
        });
      } catch (e) {
        console.error(`Failed to rename group: ${e}`);
      }
    }

    const disbandGroup = async () => {}

    const makeContribution = async (groupId: string, amount: string) => {
      return await fetchy(`/api/groups/transactions/contribute/${groupId}`, "PATCH",
        { body: { amount }, alert: true }
      );
    }

    const makeWithdrawal = async (groupId: string, amount: string) => {
      try {
        return await fetchy(`/api/groups/transactions/withdraw/${groupId}`, "PATCH",
          { body: { amount }, alert: true }
        );
      } catch (e) {
        console.error(`Failed to make withdrawal: ${e}`);
      }
    }

    const sendGroupInvitation = async (id: string, recipient: string) => {
      try {
        return await fetchy(`/api/groups/invitations/${id}`, "POST", { body: { recipient }, alert: true });
      } catch (e) {
        console.error(`Error inviting user to group: ${e}`);
        return { error: e }
      }
    }

    const fetchInvitation = async (id: string) => {
      return await fetchy(`/api/groups/invitations/${id}`, "GET", { alert: false });
    }

    const getInvitationsByUser = async (id: string)=> {
      return await fetchy(`/api/groups/invitations/user/${id}`, "GET", { alert: false });
    }

    const getInvitationsByGroup = async (id: string) => {
      return await fetchy(`/api/groups/invitations/group/${id}`, "GET", { alert: false });
    }

    const acceptInvitation = async (id: string) => {
      return await fetchy(`/api/groups/invitations/accept/${id}`, "PATCH", { alert: true });
    }

    const declineInvitation = async (id: string) => {
      return await fetchy(`/api/groups/invitations/accept/${id}`, "PATCH", { alert: true });
    }

    return {
      allGroups,
      activeGroup,
      fetchGroup,
      setActiveGroup,
      filterGroupsByOrganizer,
      refreshGroups,
      createGroup,
      renameGroup,
      disbandGroup,
      makeContribution,
      makeWithdrawal,
      sendGroupInvitation,
      getInvitationsByUser,
      getInvitationsByGroup,
      acceptInvitation,
      declineInvitation,
      fetchInvitation,
    }
  },
  { persist: true },
)