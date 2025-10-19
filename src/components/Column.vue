<script setup>
import TaskCard from './TaskCard.vue';
import { useUserStore } from '@/stores/userStore';

const userStore = useUserStore();

const props = defineProps({
  column: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['addTask', 'editTask']);

function handleEditTask(task) {
  emit('editTask', { task, columnId: props.column.id });
}
</script>

<template>
  <div class="w-80 bg-gray-200 dark:bg-gray-700 rounded-lg p-3 flex flex-col">
    <h2 class="font-bold mb-3">{{ column.name }}</h2>
    <div class="flex-grow space-y-3 overflow-y-auto">
      <TaskCard v-for="task in column.tasks" :key="task.id" :task="task" @click="handleEditTask(task)" />
    </div>
    <button
      v-if="userStore.isAdmin"
      @click="$emit('addTask', { columnId: column.id })"
      class="mt-4 p-2 w-full text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md transition-colors"
    >
      + Add Task
    </button>
  </div>
</template>