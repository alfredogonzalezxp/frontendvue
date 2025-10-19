<script setup>
import { ref, watch } from 'vue';
import { useUserStore } from '@/stores/userStore';

const props = defineProps({
  task: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['close', 'update-task']);

const userStore = useUserStore();
const newCommentText = ref('');

const getCommentUser = (userId) => {
  return userStore.users.find(u => u.id === userId) || { name: 'Unknown User' };
};

function addComment() {
  if (!props.task || !newCommentText.value.trim()) return;

  const updatedTask = JSON.parse(JSON.stringify(props.task));
  if (!updatedTask.comments) {
    updatedTask.comments = [];
  }

  updatedTask.comments.unshift({
    id: `comment-${Date.now()}`,
    userId: userStore.currentUser.id,
    text: newCommentText.value.trim(),
    timestamp: new Date().toISOString(),
  });

  newCommentText.value = '';
  emit('update-task', updatedTask);
}

function addAttachment() {
  if (!props.task) return;

  const fileName = prompt("Enter attachment name:", "document.pdf");
  if (fileName) {
    const updatedTask = JSON.parse(JSON.stringify(props.task));
    if (!updatedTask.attachments) {
      updatedTask.attachments = [];
    }
    updatedTask.attachments.push({ id: `att-${Date.now()}`, name: fileName, url: '#' });
    emit('update-task', updatedTask);
  }
}
</script>

<template>
  <div v-if="task" class="w-96 bg-gray-100 dark:bg-gray-800 p-4 flex flex-col h-full border-l border-gray-300 dark:border-gray-600">
    <!-- Header -->
    <div class="flex justify-between items-center mb-4 pb-2 border-b border-gray-300 dark:border-gray-600">
      <h2 class="text-xl font-bold truncate pr-2" :title="task.title">{{ task.title }}</h2>
      <button @click="$emit('close')" class="text-gray-500 hover:text-gray-800 dark:hover:text-gray-200">&times;</button>
    </div>

    <!-- Scrollable Content -->
    <div class="flex-grow overflow-y-auto space-y-6 pr-2">
      <!-- Attachments Section -->
      <div>
        <h3 class="font-semibold mb-2">Attachments</h3>
        <div class="flex flex-wrap gap-2 mb-2">
          <a v-for="file in task.attachments" :key="file.id" :href="file.url" target="_blank" class="flex items-center px-2 py-1 bg-gray-300 dark:bg-gray-700 rounded-md text-sm hover:bg-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
            {{ file.name }}
          </a>
        </div>
        <button type="button" @click="addAttachment" class="w-full px-3 py-2 bg-gray-200 dark:bg-gray-600 text-sm rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">
          + Add Attachment
        </button>
      </div>

      <!-- Comments Section -->
      <div>
        <h3 class="font-semibold mb-2">Comments</h3>
        <!-- New Comment Form -->
        <div class="mb-4">
          <textarea v-model="newCommentText" rows="2" placeholder="Write a comment..." @keydown.enter.prevent="addComment" class="w-full p-2 border rounded-md bg-gray-200 dark:bg-gray-700"></textarea>
          <button type="button" @click="addComment" class="mt-2 px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm">
            Post Comment
          </button>
        </div>
        <!-- Existing Comments -->
        <div class="space-y-3">
          <div v-for="comment in task.comments" :key="comment.id" class="bg-white dark:bg-gray-700/50 p-3 rounded-md text-sm">
            <div class="flex items-center justify-between mb-1">
              <span class="font-semibold">{{ getCommentUser(comment.userId).name }}</span>
              <span class="text-xs text-gray-500">{{ new Date(comment.timestamp).toLocaleString() }}</span>
            </div>
            <p class="whitespace-pre-wrap">{{ comment.text }}</p>
          </div>
          <p v-if="!task.comments || !task.comments.length" class="text-xs text-gray-500 italic">
            No comments yet.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>