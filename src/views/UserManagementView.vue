<script setup>
import { onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import { useUserStore } from '@/stores/userStore';

const userStore = useUserStore();

onMounted(() => {
  userStore.fetchUsers();
});

async function deleteUser(user) {
  if (window.confirm(`Are you sure you want to delete user "${user.name}" (${user.email})?`)) {
    try {
      await userStore.deleteUser(user.id);
    } catch (error) {
      alert(`Error deleting user: ${error.message}`);
    }
  }
}
</script>

<template>
  <div class="p-8 max-w-4xl mx-auto">
    <h1 class="text-2xl font-bold mb-6">User Management</h1>
    <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
      <table class="min-w-full leading-normal">
        <thead>
          <tr>
            <th class="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-left text-xs font-semibold uppercase tracking-wider">Name</th>
            <th class="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-left text-xs font-semibold uppercase tracking-wider">Email</th>
            <th class="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-left text-xs font-semibold uppercase tracking-wider">Role</th>
            <th class="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-left text-xs font-semibold uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in userStore.users" :key="user.id">
            <td class="px-5 py-5 border-b border-gray-200 dark:border-gray-700 text-sm">
              <p class="whitespace-no-wrap">{{ user.name }}</p>
            </td>
            <td class="px-5 py-5 border-b border-gray-200 dark:border-gray-700 text-sm">
              <p class="whitespace-no-wrap">{{ user.email }}</p>
            </td>
            <td class="px-5 py-5 border-b border-gray-200 dark:border-gray-700 text-sm">
              <span class="relative inline-block px-3 py-1 font-semibold leading-tight rounded-full" :class="user.role && user.role.toUpperCase() === 'ADMIN' ? 'bg-green-200 text-green-900' : 'bg-gray-200 text-gray-900 dark:bg-gray-600 dark:text-gray-200'">{{ user.role }}</span>
            </td>
            <td class="px-5 py-5 border-b border-gray-200 dark:border-gray-700 text-sm space-x-4">
              <RouterLink :to="`/edit-user/${user.id}`" class="text-indigo-600 hover:text-indigo-900">Edit</RouterLink>
              <button @click="deleteUser(user)" class="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed" :disabled="user.id === userStore.currentUser.id">
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>