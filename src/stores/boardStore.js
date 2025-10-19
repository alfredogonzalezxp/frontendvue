import { defineStore } from 'pinia';

export const useBoardStore = defineStore('board', {
  state: () => ({
    board: {
      id: 'board-1',
      name: 'My Project Board',
      columns: [
        {
          id: 'col-1',
          name: 'To Do',
          tasks: [
            {
              id: 'task-1',
              title: 'Setup project structure',
              description: 'Create the initial file and folder structure for the project.',
              dueDate: '2024-06-15',
              progress: 100, // percentage
              priority: 'medium',
            },
            {
              id: 'task-2',
              title: 'Create basic components',
              description: 'Build the basic Vue components like Board, Column, and TaskCard.',
              dueDate: '2024-06-18',
              progress: 80,
              priority: 'low',
            },
          ],
        },
        {
          id: 'col-2',
          name: 'In Progress',
          tasks: [
            {
              id: 'task-3',
              title: 'Design the UI',
              description: 'Create mockups and design system for the application.',
              dueDate: '2024-06-25',
              progress: 40,
              priority: 'high',
            },
          ],
        },
        {
          id: 'col-3',
          name: 'Done',
          tasks: [],
        },
      ],
    },
  }),
  getters: {
    getBoard: (state) => state.board,
  },
  actions: {
    /**
     * Simulates fetching the board from a database.
     */
    async fetchBoard() {
      return new Promise((resolve) => {
        // In a real app, you'd make an API call here.
        setTimeout(() => resolve(this.board), 500);
      });
    },

    /**
     * Simulates adding a task to a column.
     * @param {string} columnId
     * @param {object} taskData
     */
    async addTask(columnId, taskData) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const column = this.board.columns.find((c) => c.id === columnId);
          if (column) {
            const newTask = { id: `task-${Date.now()}`, progress: 0, ...taskData };
            column.tasks.push(newTask);
            resolve(newTask);
          }
        }, 300); // Simulate network delay
      });
    },

    /**
     * Simulates editing a task.
     * @param {string} columnId
     * @param {object} taskData
     */
    async editTask(columnId, taskData) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const column = this.board.columns.find((c) => c.id === columnId);
          if (column) {
            const taskIndex = column.tasks.findIndex((t) => t.id === taskData.id);
            if (taskIndex !== -1) {
              // Use Object.assign to update the properties of the existing task object
              Object.assign(column.tasks[taskIndex], taskData);
              resolve(column.tasks[taskIndex]);
            }
          }
        }, 300); // Simulate network delay
      });
    },
  },
});