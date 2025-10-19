<script setup>
import { ref, watch, nextTick } from 'vue';
import { useUserStore } from '@/stores/userStore';

const props = defineProps({
  show: Boolean,
  task: {
    type: Object,
    default: null,
  },
});

const userStore = useUserStore();

const emit = defineEmits(['close', 'save']);

const form = ref({
  title: '',
  description: '',
  dueDate: '',
  priority: 'medium',
  labels: [],
  assignedTo: null,
});

const newLabelText = ref('');
const newLabelColor = ref('#4A90E2'); // Default label color

watch(() => props.task, (newTask) => {
  if (newTask) {
    // Make a deep copy to avoid mutating the original task object directly
    form.value = JSON.parse(JSON.stringify(newTask));
    if (!form.value.labels) {
      form.value.labels = [];
    }
    if (form.value.assignedTo === undefined) {
      form.value.assignedTo = null;
    }
  } else {
    // Reset form for creating a new task
    form.value = {
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium',
      labels: [],
      assignedTo: null,
    };
  }
}, { immediate: true });

function save() {
  emit('save', { ...form.value });
  emit('close');
}

function addLabel() {
  if (newLabelText.value && !form.value.labels.some(label => label.text === newLabelText.value)) {
    form.value.labels.push({
      text: newLabelText.value,
      color: newLabelColor.value,
    });
    newLabelText.value = ''; // Reset input
  }
}

function removeLabel(labelText) {
  form.value.labels = form.value.labels.filter(label => label.text !== labelText);
}

</script>

<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md flex flex-col max-h-[90vh]">
      <h2 class="text-2xl font-bold mb-4">{{ task ? 'Edit Task' : 'Create Task' }}</h2>
      <div class="flex-grow overflow-y-auto pr-2">
        <form @submit.prevent="save" id="task-form" class="space-y-4">
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
          <!-- Assignee -->
          <div>
            <label for="assignedTo" class="block mb-1">Assign To:</label>
            <select id="assignedTo" v-model="form.assignedTo" class="w-full p-2 border rounded-md bg-gray-200 dark:bg-gray-700">
              <option :value="null">Unassigned</option>
              <option v-for="user in userStore.users" :key="user.id" :value="user.id">
                {{ user.name }}
              </option>
            </select>
          </div>
          <!-- Label Management -->
          <div>
            <label class="block mb-1">Labels:</label>
            <div class="flex flex-wrap gap-2 mb-2">
              <span v-for="label in form.labels" :key="label.text" class="flex items-center px-2 py-1 text-xs font-semibold rounded-full" :style="{ backgroundColor: label.color, color: '#ffffff' }">
                {{ label.text }}
                <button type="button" @click="removeLabel(label.text)" class="ml-1.5 text-white hover:text-gray-200">
                  &times;
                </button>
              </span>
            </div>
            <div class="flex items-center gap-2">
              <input type="text" v-model="newLabelText" placeholder="New label..." @keydown.enter.prevent="addLabel" class="flex-grow p-2 border rounded-md bg-gray-200 dark:bg-gray-700" />
              <input type="color" v-model="newLabelColor" class="w-10 h-10 p-1 border-none rounded-md cursor-pointer bg-gray-200 dark:bg-gray-700" />
              <button
                type="button"
                @click="addLabel"
                class="px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Add
              </button>
            </div>
          </div>
        </form>
      </div>
      <!-- Modal Actions -->
      <div class="flex justify-end gap-4 mt-6 pt-4 border-t border-gray-300 dark:border-gray-600">
        <button type="button" @click="$emit('close')" class="px-4 py-2 bg-gray-300 text-gray-800 dark:bg-gray-600 dark:text-gray-200 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500">
          Cancel
        </button>
        <button type="submit" form="task-form" class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600" i18n-text="Aceptar">
          Save
        </button>
      </div>
    </div>
  </div>
</template>