<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userStore';

const userStore = useUserStore();
const router = useRouter();

const email = ref('');
const password = ref('');
const error = ref(null);

async function handleLogin() {
  error.value = null;
  try {
    await userStore.login({ email: email.value, password: password.value });
    router.push('/');
  } catch (err) {
    error.value = err.message;
  }
}
</script>

<template>
  <div class="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-800">
    <div class="p-8 bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-sm">
      <h1 class="text-2xl font-bold mb-6 text-center">Login</h1>
      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label for="email" class="block mb-2">Email:</label>
          <input type="email" id="email" v-model="email" required class="w-full p-2 border rounded-md bg-gray-200 dark:bg-gray-700" placeholder="admin@test.com">
        </div>
        <div class="mb-6">
          <label for="password" class="block mb-2">Password:</label>
          <input type="password" id="password" v-model="password" required class="w-full p-2 border rounded-md bg-gray-200 dark:bg-gray-700" placeholder="password">
        </div>
        <p v-if="error" class="text-red-500 text-sm mb-4">{{ error }}</p>
        <button type="submit" class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">Login</button>
      </form>
    </div>
  </div>
</template>