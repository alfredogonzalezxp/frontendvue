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

function closeModal() {
  showModal.value = false;
  editingTask.value = null;
  // editingColumnId is not reset, so it's available for handleSaveTask
}

async function handleSaveTask(taskData) {
  const column = boardStore.board.columns.find(c => c.id === editingColumnId.value);
  if (!column) return;

  if (taskData.id) { // Editing existing task
    await boardStore.editTask(editingColumnId.value, taskData);
    if (selectedTask.value && selectedTask.value.id === taskData.id) {
      const taskIndex = column.tasks.findIndex(t => t.id === taskData.id);
      if (taskIndex !== -1) {
        selectedTask.value = { ...column.tasks[taskIndex] };
      }
    }
  } else {
    const newTask = await boardStore.addTask(editingColumnId.value, taskData);
    if (column) {
      column.tasks.push(newTask);
    }
  }
  closeModal();
}
</script>

<template>
  <div class="flex flex-1 overflow-hidden h-full relative">
    <div class="flex-1 p-4 overflow-x-auto h-full">
      <Board @add-task="handleAddTask" @edit-task="handleEditTask" @select-task="handleSelectTask" />
    </div>

    <!-- Sidebar Backdrop (for mobile/tablet) -->
    <div v-if="selectedTask" @click="selectedTask = null" class="lg:hidden fixed inset-0 bg-black/30 z-30"></div>

    <TaskFormModal
      :show="showModal"
      :task="editingTask"
      @close="closeModal"
      @save="handleSaveTask"
    />

    <Transition name="slide-fade">
      <TaskDetailsSidebar
        v-if="selectedTask"
        :task="selectedTask"
        @close="selectedTask = null"
        @update-task="handleSaveTask"
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