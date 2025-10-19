<script setup>
import TaskCard from './TaskCard.vue';
import { useUserStore } from '@/stores/userStore';
import { VueDraggableNext } from 'vue-draggable-next';

const userStore = useUserStore();

const props = defineProps({
  column: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['addTask', 'editTask', 'selectTask', 'update:column']);

function handleEditTask(task) {
  emit('editTask', { task, columnId: props.column.id });
}

function handleSelectTask(task) {
  emit('selectTask', { task, columnId: props.column.id });
}
</script>

<template>
  <div class="w-full md:w-80 bg-gray-200 dark:bg-gray-700 rounded-lg p-3 flex flex-col">
    <h2 class="font-bold mb-3 flex-shrink-0">{{ column.name }}</h2>
    <VueDraggableNext
      class="flex-grow space-y-3 overflow-y-auto"
      :list="column.tasks"
      group="tasks"
      item-key="id"
      @change="$emit('update:column', { ...column, tasks: $event.moved ? column.tasks : $event.added ? column.tasks : $event.removed ? column.tasks : [] })"
    >
      <TaskCard v-for="task in column.tasks" :key="task.id" :task="task" @click="handleSelectTask(task)" @dblclick.prevent="userStore.isAdmin && handleEditTask(task)" />
    </VueDraggableNext>

    <button
      v-if="userStore.isAdmin"
      @click="$emit('addTask', { columnId: column.id })"
      class="mt-4 p-2 w-full text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md transition-colors"
    >
      + Add Task
    </button>
  </div>
</template>pm