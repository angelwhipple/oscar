<script setup lang="ts">
import { defineProps } from "vue"

const props = defineProps(["onClick"])
</script>

<template>
  <button class="styled-button" @click="props.onClick">
    <slot></slot>
  </button>

</template>

<style scoped>
.styled-button {
  width: fit-content;
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 0.75em 1.5em;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

.styled-button:hover {
  background-color: #0056b3;
}
</style>