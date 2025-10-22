<script setup>
import { onMounted, computed } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userStore';

const userStore = useUserStore();
const router = useRouter();

onMounted(() => {
  userStore.fetchUsers();
});

const filteredUsers = computed(() => {
  if (!userStore.searchQuery) {
    return userStore.users;
  }
  const query = userStore.searchQuery.toLowerCase();
  return userStore.users.filter(user => user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query));
});

async function deleteUser(user) {
  if (window.confirm(`Are you sure you want to delete user "${user.name}" (${user.email})?`)) {
    try {
      await userStore.deleteUser(user.id);
      // If the admin deletes another user, just show a success message and refresh the list.
      // The logout logic is now only triggered if the deleted user is the current user,
      // which is handled by the disabled button, but this is a good safeguard.
      if (userStore.currentUser && userStore.currentUser.id !== user.id) {
        alert('User deleted successfully.');
        // The user is removed from the local state by the store action, so no extra fetch is needed.
      }
      // After a successful deletion, alert the user, log them out, and redirect to the login page.
      alert('User deleted successfully. You will now be logged out as a security measure.');
      userStore.logout();
      router.push('/login');

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
          <tr v-for="user in filteredUsers" :key="user.id">
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