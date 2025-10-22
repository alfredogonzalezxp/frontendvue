<script setup>
import { ref, onMounted } from 'vue';
import Board from '@/components/Board.vue';
import TaskFormModal from '@/components/TaskFormModal.vue';
import TaskDetailsSidebar from '@/components/TaskDetailsSidebar.vue';
import { useBoardStore } from '@/stores/boardStore';
import { useUserStore } from '@/stores/userStore';

const boardStore = useBoardStore();
const userStore = useUserStore();

const showModal = ref(false);
const selectedTask = ref(null);
const editingTask = ref(null);
const editingColumnId = ref(null);

onMounted(async () => {
  await userStore.fetchUsers();
  await boardStore.fetchBoard();
});

function handleSelectTask({ task, columnId }) {
  selectedTask.value = task;
  editingColumnId.value = columnId;
}

function handleEditTask({ task, columnId }) {
  editingTask.value = task;
  editingColumnId.value = columnId;
  showModal.value = true;
}

function handleAddTask({ columnId }) {
  handleEditTask({ task: null, columnId });
}

async function handleDeleteTask(task) {
  if (window.confirm(`Are you sure you want to delete the task "${task.title}"?`)) {
    await boardStore.deleteTask(task.id);
    // If the deleted task was selected, close the sidebar
    if (selectedTask.value && selectedTask.value.id === task.id) {
      selectedTask.value = null;
    }
    closeModal();
  }
}

function closeModal() {
  showModal.value = false;
  editingTask.value = null;
  // editingColumnId is not reset, so it's available for handleSaveTask
}

async function handleSaveTask(taskData) {
  let column = boardStore.board.columns.find(c => c.id === editingColumnId.value);
  if (!column) return;

  if (taskData.id) { // Editing existing task
    await boardStore.updateTask(taskData);
    if (selectedTask.value && selectedTask.value.id === taskData.id) {
      // The selectedTask is reactive, so it will update automatically.
      // To be safe and ensure reactivity, we can re-assign it.
      const updatedTask = await boardStore.updateTask(taskData); // Ensure reactivity by getting the updated task from store
      if (updatedTask) selectedTask.value = updatedTask;
    }
  } else {
    await boardStore.addTask(editingColumnId.value, taskData);
    // After adding, re-fetch the board to ensure state is consistent with backend
    // or, if backend returns the new task with its final ID, push it to the column
    // For simplicity, let's assume addTask updates the local state directly for now
    // (as implemented in the diff for boardStore.js)
  }
  closeModal();
}
</script>

<template>
  <div class="flex flex-1 overflow-hidden h-full relative">
    <div class="flex-1 p-4 overflow-x-auto h-full">
      <Board @add-task="handleAddTask" @edit-task="handleEditTask" @select-task="handleSelectTask" @deleteTask="handleDeleteTask" />
    </div>

    <!-- Sidebar Backdrop (for mobile/tablet) -->
    <div v-if="selectedTask" @click="selectedTask = null" class="lg:hidden fixed inset-0 bg-black/30 z-30"></div>

    <TaskFormModal
      :show="showModal"
      :task="editingTask"
      @close="closeModal"
      @save="handleSaveTask"
      @delete="handleDeleteTask"
    />

    <Transition name="slide-fade">
      <TaskDetailsSidebar
        v-if="selectedTask"
        :task="selectedTask"
        @close="selectedTask = null"
      />
    </Transition>
  </div>
</template>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>