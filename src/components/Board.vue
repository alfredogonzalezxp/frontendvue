<script setup>
import { computed } from 'vue';
import Column from './Column.vue';
import { useBoardStore } from '@/stores/boardStore';

const boardStore = useBoardStore();
const board = computed(() => boardStore.getBoard);
</script>

<template>
  <div class="flex flex-col md:flex-row gap-4 h-full">
    <Column
      v-if="board && board.columns"
      v-for="column in board.columns"
      :key="column.id"
      :column="column" @add-task="$emit('addTask', $event)" @edit-task="$emit('editTask', $event)"
    />
  </div>
</template>