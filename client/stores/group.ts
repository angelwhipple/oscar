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
        return await fetchy(`/api/groups/organizer/${organizer}`, "GET", { alert: true });
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

    const makeContribution = async (groupId: string, amount: number) => {
      return await fetchy(`/api/groups/transactions/contribute/${groupId}`, "PATCH",
        { body: { amount }, alert: true }
      );
    }

    const makeWithdrawal = async (groupId: string, amount: number) => {
      try {
        return await fetchy(`/api/groups/transactions/withdraw/${groupId}`, "PATCH",
          { body: { amount }, alert: true }
        );
      } catch (e) {
        console.error(`Failed to make withdrawal: ${e}`);
      }
    }

    const sendGroupRequest = async (id: string, sender: string, recipient: string, type: string) => {
      try {
        return await fetchy(`/api/groups/requests/${id}`, "POST", {
          body: { sender, recipient, type }, alert: true
        });
      } catch (e) {
        console.error(`Error inviting user to group: ${e}`);
        return { error: e }
      }
    }

    const fetchRequest = async (id: string) => {
      return await fetchy(`/api/groups/requests/${id}`, "GET", { alert: false });
    }

    const getRequestsByUser = async (id: string)=> {
      return await fetchy(`/api/groups/requests/user/${id}`, "GET", { alert: false });
    }

    const getRequestsByGroup = async (id: string) => {
      return await fetchy(`/api/groups/requests/group/${id}`, "GET", { alert: false });
    }

    const acceptRequest = async (id: string, type: string) => {
      return await fetchy(`/api/groups/requests/accept/${id}`, "PATCH", {
        body: { type }, alert: true
      });
    }

    const declineRequest = async (id: string) => {
      return await fetchy(`/api/groups/requests/accept/${id}`, "PATCH", { alert: true });
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
      sendGroupRequest,
      getRequestsByUser,
      getRequestsByGroup,
      acceptRequest,
      declineRequest,
      fetchRequest,
    }
  },
  { persist: true },
)