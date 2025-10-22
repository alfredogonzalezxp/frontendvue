<script setup>
import { ref } from 'vue';
import { useUserStore } from '@/stores/userStore.js';

const props = defineProps({
  show: Boolean,
});

const emit = defineEmits(['close']);

const userStore = useUserStore();

const newUserName = ref('');
const newUserEmail = ref('');
const newUserPassword = ref('');
const newUserRole = ref('WORKER'); // Default role

async function createUser() {
  if (newUserName.value.trim() && newUserEmail.value.trim() && newUserPassword.value.trim()) {
    await userStore.createUser({
      name: newUserName.value,
      email: newUserEmail.value,
      role: newUserRole.value.toUpperCase(),
      password: newUserPassword.value,
    });
    emit('close'); // Close the modal on success
  }
}
</script>

<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md flex flex-col max-h-[90vh]">
      <h2 class="text-2xl font-bold mb-4">Create New User</h2>
      <div class="flex-grow overflow-y-auto pr-2">
        <form @submit.prevent="createUser" id="user-create-form" class="space-y-4">
          <div>
            <label for="name" class="block mb-1">Name:</label>
            <input type="text" id="name" v-model="newUserName" required class="w-full p-2 border rounded-md bg-gray-200 dark:bg-gray-700">
          </div>
          <div>
            <label for="email" class="block mb-1">Email:</label>
            <input type="email" id="email" v-model="newUserEmail" required class="w-full p-2 border rounded-md bg-gray-200 dark:bg-gray-700">
          </div>
          <div>
            <label for="password" class="block mb-1">Password:</label>
            <input type="password" id="password" v-model="newUserPassword" required class="w-full p-2 border rounded-md bg-gray-200 dark:bg-gray-700">
          </div>
          <div>
            <label for="role" class="block mb-1">Role:</label>
            <select id="role" v-model="newUserRole" class="w-full p-2 border rounded-md bg-gray-200 dark:bg-gray-700">
              <option value="WORKER">Worker</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
        </form>
      </div>
      <div class="flex justify-end gap-4 mt-6 pt-4 border-t border-gray-300 dark:border-gray-600">
        <button type="button" @click="$emit('close')" class="px-4 py-2 bg-gray-300 text-gray-800 dark:bg-gray-600 dark:text-gray-200 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500">Cancel</button>
        <button type="submit" form="user-create-form" class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Create User</button>
      </div>
    </div>
  </div>
</template>