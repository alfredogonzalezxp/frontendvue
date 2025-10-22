<script setup>
import { useUserStore } from '@/stores/userStore.js';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();

function handleLogout() {
  userStore.logout();
  router.push('/login');
}
</script>

<template>
  <header class="bg-white dark:bg-gray-900 shadow-md p-4 flex items-center">
    <h1 class="text-xl font-bold">TaskBoard Pro</h1>
    <div class="flex-grow"></div>

    <template v-if="userStore.isAuthenticated">
      <!-- User Info -->
      <div class="mr-4 hidden sm:block">
        Welcome, <span class="font-semibold">{{ userStore.currentUser.name }}</span> ({{ userStore.currentUser.role }})
      </div>

      <!-- "Manage Users" button for admins -->
      <router-link v-if="userStore.isAdmin" to="/manage-users" class="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mr-4">
        Manage Users
      </router-link>

      <!-- "Add User" button for admins -->
      <router-link v-if="userStore.isAdmin" to="/create-user" class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mr-4">
        Add User
      </router-link>

      <!-- Logout Button -->
      <button @click="handleLogout" class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded mr-4">
        Logout
      </button>
    </template>

    <div class="relative">
      <input type="search" placeholder="Search..." class="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
    </div>
  </header>
</template>