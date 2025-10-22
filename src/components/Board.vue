<script setup>
import { computed, onMounted } from 'vue';
import Column from './Column.vue';
import { useBoardStore } from '@/stores/boardStore';

const boardStore = useBoardStore();
const board = computed(() => boardStore.getBoard);

// Fetch the board data when the component is mounted
onMounted(() => {
  boardStore.fetchBoard();
});
</script>

<template>
  <div class="flex flex-col md:flex-row gap-4 h-full">
    <Column
      v-if="board && board.columns"
      v-for="column in board.columns"
      :key="column.id"
      :column="column" @add-task="$emit('addTask', $event)" @edit-task="$emit('editTask', $event)" @select-task="$emit('selectTask', $event)"
    />
  </div>
</template>