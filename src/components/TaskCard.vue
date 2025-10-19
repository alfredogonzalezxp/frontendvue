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

const assignee = computed(() => {
  return props.task.assignedTo ? userStore.users.find(u => u.id === props.task.assignedTo) : null;
});
 
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
    :class="'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50'"
  >
    <!-- Priority Indicator -->
    <div class="flex items-center gap-2 mb-1">
      <span class="h-3 w-3 rounded-full" :class="priorityColorClass"></span>
      <span class="text-xs font-medium">{{ priorityText }}</span>
    </div>

    <!-- Labels -->
    <div v-if="task.labels && task.labels.length" class="flex flex-wrap gap-1">
      <span
        v-for="label in task.labels"
        :key="label.text"
        class="px-2 py-0.5 text-xs font-semibold rounded-full"
        :style="{ backgroundColor: label.color, color: '#ffffff' }"
      >{{ label.text }}</span>
    </div>

    <p class="font-semibold">{{ task.title }}</p>

    <!-- Description (optional) -->
    <p v-if="task.description" class="text-sm text-gray-600 dark:text-gray-400">
      {{ task.description }}
    </p>

    <!-- Assignee -->
    <div v-if="assignee" class="flex items-center gap-2 mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
      </svg>
      <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
        {{ assignee.name }}
      </span>
    </div>

    <!-- Comments and Attachments Indicators -->
    <div class="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mt-2">
      <div v-if="task.attachments && task.attachments.length" class="flex items-center gap-1">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
        </svg>
        <span>{{ task.attachments.length }}</span>
      </div>
      <div v-if="task.comments && task.comments.length" class="flex items-center gap-1">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <span>{{ task.comments.length }}</span>
      </div>
    </div>

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