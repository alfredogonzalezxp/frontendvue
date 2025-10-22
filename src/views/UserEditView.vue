<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userStore';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const userId = route.params.id;
const userForm = ref({
  name: '',
  email: '',
  role: 'WORKER',
  password: '',
});
const isLoading = ref(true);
const error = ref(null);

onMounted(async () => {
  try {
    const user = await userStore.fetchUserById(userId);
    if (user) {
      userForm.value.name = user.name;
      userForm.value.email = user.email;
      userForm.value.role = user.role.toUpperCase();
    } else {
      error.value = 'User not found.';
    }
  } catch (err) {
    error.value = `Failed to load user data: ${err.message}`;
  } finally {
    isLoading.value = false;
  }
});

async function handleSubmit() {
  try {
    const userData = {
      name: userForm.value.name,
      email: userForm.value.email,
      role: userForm.value.role,
    };
    // Only include the password if it's been changed
    if (userForm.value.password) {
      userData.password = userForm.value.password;
    }

    await userStore.updateUser(userId, userData);
    alert('User updated successfully!');
    router.push('/manage-users');
  } catch (err) {
    error.value = `Failed to update user: ${err.message}`;
    alert(error.value);
  }
}
</script>

<template>
  <div class="p-8 max-w-lg mx-auto">
    <h1 class="text-2xl font-bold mb-6">Edit User</h1>
    <div v-if="isLoading" class="text-center">Loading...</div>
    <div v-else-if="error" class="text-red-500 text-center">{{ error }}</div>
    <form v-else @submit.prevent="handleSubmit" class="space-y-6 bg-white dark:bg-gray-800 shadow-md rounded-lg p-8">
      <div>
        <label for="name" class="block text-sm font-medium">Name</label>
        <input type="text" id="name" v-model="userForm.name" required class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700">
      </div>
      <div>
        <label for="email" class="block text-sm font-medium">Email</label>
        <input type="email" id="email" v-model="userForm.email" required class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700">
      </div>
      <div>
        <label for="password" class="block text-sm font-medium">Password (leave blank to keep current)</label>
        <input type="password" id="password" v-model="userForm.password" class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700">
      </div>
      <div>
        <label for="role" class="block text-sm font-medium">Role</label>
        <select id="role" v-model="userForm.role" class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700">
          <option value="ADMIN">Admin</option>
          <option value="WORKER">Worker</option>
        </select>
      </div>
      <div class="flex justify-end space-x-4">
        <router-link to="/manage-users" class="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">
          Cancel
        </router-link>
        <button type="submit" class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
          Update User
        </button>
      </div>
    </form>
  </div>
</template>