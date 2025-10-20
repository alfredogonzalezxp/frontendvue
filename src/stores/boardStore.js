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
              assignedTo: 2, // Assign to 'Worker Bee'
              labels: [{ text: 'Setup', color: '#4A90E2' }],
              comments: [
                { id: 'comment-1', userId: 1, text: 'Initial setup complete.', timestamp: '2024-06-14T10:00:00Z' }
              ],
              attachments: [],
            },
            {
              id: 'task-2',
              title: 'Create basic components',
              description: 'Build the basic Vue components like Board, Column, and TaskCard.',
              dueDate: '2024-06-18',
              progress: 80,
              assignedTo: 2, // Assign to 'Worker Bee'
              priority: 'low', 
              labels: [{ text: 'Frontend', color: '#50E3C2' }],
              comments: [],
              attachments: [],
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
              assignedTo: 1, // Assign to 'Admin User'
              labels: [
                { text: 'Design', color: '#9013FE' },
                { text: 'Urgent', color: '#D0021B' },
              ],
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
            const newTask = { id: `task-${Date.now()}`, progress: 0, labels: [], assignedTo: null, comments: [], attachments: [], ...taskData };
            resolve(newTask);
          }
        }, 300); // Simulate network delay
      });
    },

    /**
     * Simulates updating a task. This can be used for any change.
     * @param {object} taskData
     */
    async updateTask(taskData) {
      return new Promise((resolve) => {
        setTimeout(() => {
          for (const column of this.board.columns) {
            const taskIndex = column.tasks.findIndex((t) => t.id === taskData.id);
            if (taskIndex !== -1) {
              Object.assign(column.tasks[taskIndex], taskData);
              resolve(column.tasks[taskIndex]);
              return;
            }
          }
        }, 300);
      });
    },

    /**
     * Simulates editing a task.
     * @param {object} taskData
     */
    async editTask(taskData) {
      return this.updateTask(taskData);
    },

    /**
     * Simulates adding a comment to a task.
     * @param {string} taskId
     * @param {object} commentData
     */
    async addComment(taskId, commentData) {
      return new Promise((resolve) => {
        setTimeout(() => {
          for (const column of this.board.columns) {
            const task = column.tasks.find((t) => t.id === taskId);
            if (task) {
              if (!task.comments) task.comments = [];
              task.comments.unshift(commentData);
              resolve(task);
              return;
            }
          }
        }, 300); // Simulate network delay
      });
    },

    /**
     * Simulates adding an attachment to a task.
     * @param {string} taskId
     * @param {object} attachmentData
     */
    async addAttachment(taskId, attachmentData) {
      // This is a synchronous example for simplicity.
      // In a real app, this would be an async API call.
      for (const column of this.board.columns) {
        const task = column.tasks.find((t) => t.id === taskId);
        if (task) {
          if (!task.attachments) task.attachments = [];
          task.attachments.push(attachmentData);
          return Promise.resolve(task);
        }
      }
    },
  },
});