<script setup>
import { ref } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();

const newUserName = ref('');
const newUserRole = ref('worker');
const newUserEmail = ref('');
const newUserPassword = ref('');

function createUser() {
  if (newUserName.value.trim() && newUserEmail.value.trim() && newUserPassword.value.trim()) {
    userStore.createUser({
      name: newUserName.value,
      email: newUserEmail.value,
      role: newUserRole.value,
      password: newUserPassword.value,
    });
    // Optional: Navigate back to the board or show a success message
    router.push('/');
  }
}
</script>

<template>
  <div class="p-8 max-w-md mx-auto">
    <h1 class="text-2xl font-bold mb-6">Create New User</h1>
    <form @submit.prevent="createUser" class="space-y-4">
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
          <option value="worker">Worker</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <button type="submit" class="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">Create User</button>
    </form>
  </div>
</template>