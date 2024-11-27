<template>
  <div class="permission-view">
    <h1>Welcome, {{ username }}</h1>
    <p>What would you like to do?</p>
    <PermissionOptions @select="handleSelection" />
  </div>
</template>

<script lang="ts">
import PermissionOptions from "@/components/Permission/PermissionForm.vue";
import { useUserStore } from "@/stores/user";
import { computed, defineComponent } from "vue";

export default defineComponent({
  components: { PermissionOptions },
  setup() {
    const userStore = useUserStore();
    const username = computed(() => userStore.currentUsername);

    const handleSelection = async (type: string) => {
      try {
        if (type === "organizer") {
          await userStore.addOrganizer();
        } else if (type === "member") {
          await userStore.addMember();
        }
        alert(`${type} permission successfully added!`);
      } catch (error) {
        console.error(error);
        alert("Failed to update permissions.");
      }
    };

    return {
      username,
      handleSelection,
    };
  },
});
</script>

<style scoped>
.permission-view {
  text-align: center;
}
</style>
