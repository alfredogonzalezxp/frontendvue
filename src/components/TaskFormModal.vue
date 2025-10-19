<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  show: Boolean,
  task: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['close', 'save']);

const form = ref({
  title: '',
  description: '',
  dueDate: '',
  priority: 'medium',
});

watch(() => props.task, (newTask) => {
  if (newTask) {
    form.value = { ...newTask };
  } else {
    form.value = {
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium',
    };
  }
}, { immediate: true });

function save() {
  emit('save', { ...form.value });
  emit('close');
}
</script>

<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md">
      <h2 class="text-2xl font-bold mb-4">{{ task ? 'Edit Task' : 'Create Task' }}</h2>
      <form @submit.prevent="save" class="space-y-4">
        <div>
          <label for="title" class="block mb-1">Title:</label>
          <input type="text" id="title" v-model="form.title" required class="w-full p-2 border rounded-md bg-gray-200 dark:bg-gray-700">
        </div>
        <div>
          <label for="description" class="block mb-1">Description:</label>
          <textarea id="description" v-model="form.description" rows="3" class="w-full p-2 border rounded-md bg-gray-200 dark:bg-gray-700"></textarea>
        </div>
        <div>
          <label for="dueDate" class="block mb-1">Due Date:</label>
          <input type="date" id="dueDate" v-model="form.dueDate" class="w-full p-2 border rounded-md bg-gray-200 dark:bg-gray-700">
        </div>
        <div>
          <label for="priority" class="block mb-1">Priority:</label>
          <select id="priority" v-model="form.priority" class="w-full p-2 border rounded-md bg-gray-200 dark:bg-gray-700">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div class="flex justify-end gap-4 mt-6">
          <button type="button" @click="$emit('close')" class="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500">
            Cancel
          </button>
          <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            Save
          </button>
        </div>
      </form>
    </div>
  </div>
</template>