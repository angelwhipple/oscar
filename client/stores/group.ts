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
      }
    }

    const renameGroup = async (id: string, name: string) => {
      try {
        await fetchy(`/api/groups/rename/${id}`, "PATCH", {
          body: { name: name },
        });
      } catch (e) {
        console.error(`Failed to rename group: ${e}`);
      }
    }

    const disbandGroup = async () => {}

    const makeContribution = async () => {}

    const makeWithdrawal = async () => {}

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
    }
  },
  { persist: true },
)