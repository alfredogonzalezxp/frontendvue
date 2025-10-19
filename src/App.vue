<script setup>
import NavBar from './components/NavBar.vue';
</script>

<template>
  <div id="app" class="h-screen bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 flex flex-col">
    <NavBar />
    <main class="flex-grow overflow-x-auto">
      <router-view />
    </main>
  </div>
</template>
