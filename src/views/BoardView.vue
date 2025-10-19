<script setup>
import Board from '@/components/Board.vue';
import TaskFormModal from '@/components/TaskFormModal.vue';
import { ref } from 'vue';
import { useBoardStore } from '@/stores/boardStore';

const boardStore = useBoardStore();
const showTaskModal = ref(false);
const taskColumnId = ref(null);
const editingTask = ref(null);

function handleAddTask({ columnId }) {
  taskColumnId.value = columnId;
  editingTask.value = null; // Ensure we're in "create" mode
  showTaskModal.value = true;
}

function handleEditTask({ task, columnId }) {
  taskColumnId.value = columnId;
  editingTask.value = task;
  showTaskModal.value = true;
}

async function handleSaveTask(taskData) {
  if (taskData.id) {
    // It's an existing task, so we edit it.
    await boardStore.editTask(taskColumnId.value, taskData);
  } else {
    // It's a new task, so we add it.
    await boardStore.addTask(taskColumnId.value, taskData);
  }
  // The modal is closed by the event emitter in the modal itself
}
</script>

<template>
  <div class="p-4 h-full">
    <Board @add-task="handleAddTask" @edit-task="handleEditTask" />
    <TaskFormModal
      :show="showTaskModal"
      :task="editingTask"
      @close="showTaskModal = false"
      @save="handleSaveTask"
    />
  </div>
</template>