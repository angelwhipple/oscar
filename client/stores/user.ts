import { defineStore } from "pinia";
import { computed, ref } from "vue";

import { fetchy } from "@/utils/fetchy";

export const useUserStore = defineStore(
  "user",
  () => {
    const currentUsername = ref("");
    const currentUserId = ref(""); // New state to store the user's ID
    const role = ref("")

    const isLoggedIn = computed(() => currentUsername.value !== "");

    const resetStore = () => {
      currentUsername.value = "";
      currentUserId.value = ""; // Reset the user ID when the store is reset
    };

    const createUser = async (username: string, password: string) => {
      await fetchy("/api/users", "POST", {
        body: { username, password },
      });
    };

    const fetchUser = async (id: string) => {
      return await fetchy(`/api/users/${id}`, "GET", { alert: false });
    }

    const loginUser = async (username: string, password: string) => {
      await fetchy("/api/login", "POST", {
        body: { username, password },
      });
    };

    const updateSession = async () => {
      try {
        const { username, _id } = await fetchy("/api/session", "GET", { alert: false });
        currentUsername.value = username;
        currentUserId.value = _id; // Update the current user ID from the session data
      } catch {
        currentUsername.value = "";
        currentUserId.value = ""; // Reset the user ID if session update fails
      }
    };

    const logoutUser = async () => {
      await fetchy("/api/logout", "POST");
      resetStore();
    };

    const updateUserUsername = async (username: string) => {
      await fetchy("/api/users/username", "PATCH", { body: { username } });
    };

    const updateUserPassword = async (currentPassword: string, newPassword: string) => {
      await fetchy("/api/users/password", "PATCH", { body: { currentPassword, newPassword } });
    };

    const deleteUser = async () => {
      await fetchy("/api/users", "DELETE");
      resetStore();
    };

    // Permissions
    const addMember = async () => {
      try {
        return await fetchy("/api/permissions/member", "POST");
      } catch (error) {
        console.error("Error adding member:", error);
        throw new Error("Failed to add member");
      }
    };

    const addOrganizer = async () => {
      try {
        return await fetchy("/api/permissions/organizer", "POST");
      } catch (error) {
        console.error("Error adding organizer:", error);
        throw new Error("Failed to add organizer");
      }
    };

    const refreshRole = async () => {
      role.value = await fetchy("/api/permissions", "GET", { alert: false });
      console.log(`Set role : ${role.value}`);
    }

    return {
      currentUsername,
      currentUserId, // Expose the new state
      isLoggedIn,
      createUser,
      loginUser,
      fetchUser,
      updateSession,
      logoutUser,
      updateUserUsername,
      updateUserPassword,
      deleteUser,
      addMember,
      addOrganizer,
      refreshRole,
      role
    };
  },
  { persist: true },
);
