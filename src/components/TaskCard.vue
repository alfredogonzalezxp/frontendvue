<script setup>
import { computed } from 'vue';
import { useUserStore } from '@/stores/userStore';

const userStore = useUserStore();

const props = defineProps({
  task: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['click']);

function onClick() {
  if (userStore.isAdmin) {
    emit('click', props.task);
  }
}

const priorityColorClass = computed(() => {
  switch (props.task.priority) {
    case 'high':
      return 'bg-red-500';
    case 'medium':
      return 'bg-yellow-500';
    case 'low':
      return 'bg-blue-500';
    default:
      return 'bg-gray-400';
  }
});

const priorityText = computed(() => {
  if (!props.task.priority) {
    return '';
  }
  // Capitalize the first letter
  return props.task.priority.charAt(0).toUpperCase() + props.task.priority.slice(1);
});
</script>

<template>
  <div
    class="bg-white dark:bg-gray-800 p-3 rounded-md shadow-sm flex flex-col gap-2"
    :class="{
      'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50': userStore.isAdmin,
    }"
    @click="onClick"
  >
    <!-- Priority Indicator -->
    <div class="flex items-center gap-2 mb-1">
      <span class="h-3 w-3 rounded-full" :class="priorityColorClass"></span>
      <span class="text-xs font-medium">{{ priorityText }}</span>
    </div>

    <p class="font-semibold">{{ task.title }}</p>

    <!-- Description (optional) -->
    <p v-if="task.description" class="text-sm text-gray-600 dark:text-gray-400">
      {{ task.description }}
    </p>

    <!-- Progress Bar -->
    <div v-if="task.progress != null" class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
      <div class="bg-blue-600 h-2.5 rounded-full" :style="{ width: task.progress + '%' }"></div>
    </div>

    <!-- Due Date -->
    <div v-if="task.dueDate" class="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <span>{{ task.dueDate }}</span>
    </div>
  </div>
</template>