<script setup lang="ts">
import { defineEmits, ref } from "vue";
import { useGroupStore } from "@/stores/group";

const emit = defineEmits(["cancel-create"]);
const groupStore = useGroupStore();

const groupName = ref("");
const rules = ref("");
const endDate = ref("");
const frequency = ref(0);
const contribution = ref(0);

const createGroup = async () => {
    const response = await groupStore.createGroup(groupName.value, rules.value, frequency.value, contribution.value);
    if (response.error) {
      groupName.value = "";
      return
    }
    await groupStore.refreshGroups()
    emit('cancel-create');
};

const cancelCreate = () => {
  groupName.value = "";
  rules.value = "";
  endDate.value = "";
  frequency.value = 0;
  contribution.value = 0;
  emit('cancel-create');
};
</script>

<template>
  <div class="create-group-container">
    <h2>Create a group</h2>
    <form @submit.prevent="createGroup" class="create-group-form">
      <div class="form-group">
        <label for="groupName">Name of Group:</label>
        <input id="groupName" v-model="groupName" required class="input-field" />
      </div>

      <div class="form-group">
        <label for="rules">Rules and Regulations:</label>
        <textarea id="rules" v-model="rules" class="textarea-field"></textarea>
      </div>

      <div class="form-group">
        <label for="frequency">Contribution Frequency (in weeks):</label>
        <input id="frequency" type="number" min="1" v-model="frequency" required class="input-field" />
      </div>

      <div class="form-group">
        <label for="contribution">Amount per Contribution:</label>
        <input id="contribution" type="number" v-model="contribution" required class="input-field" />
      </div>

<!--      <div class="form-group">-->
<!--        <label for="capacity">End of ROSCA cycle:</label>-->
<!--        <input id="capacity" type="date" v-model="endDate" required class="input-field" />-->
<!--      </div>-->

      <div class="form-actions">
        <button type="submit" class="create-button">Create Group</button>
        <button type="button" @click="cancelCreate" class="cancel-button">Cancel</button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.create-group-container {
  max-width: 700px;
  margin: 0 auto;
  padding: 3em;
  border: 2px solid #e0e0e0;
  border-radius: 16px;
  background-color: #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.create-group-form {
  display: flex;
  flex-direction: column;
  gap: 2em;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.input-field,
.textarea-field {
  padding: 0.75em;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.input-field:focus,
.textarea-field:focus {
  border-color: #007bff;
  outline: none;
}

.textarea-field {
  min-height: 100px;
}

.invite-member {
  display: flex;
  align-items: center;
  gap: 1em;
  margin-top: 1em;
}

.add-user-button {
  margin-top: 1em;
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 0.75em 1.5em;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

.add-user-button:hover {
  background-color: #0056b3;
}

.remove-button {
  background-color: #dc3545;
  color: #fff;
  border: none;
  padding: 0.5em 1em;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background-color 0.3s ease;
}

.remove-button:hover {
  background-color: #c82333;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 2em;
}

.create-button {
  background-color: #28a745;
  color: #fff;
  border: none;
  padding: 0.75em 2em;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

.create-button:hover {
  background-color: #218838;
}

.cancel-button {
  background-color: #6c757d;
  color: #fff;
  border: none;
  padding: 0.75em 2em;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

.cancel-button:hover {
  background-color: #5a6268;
}
</style>
