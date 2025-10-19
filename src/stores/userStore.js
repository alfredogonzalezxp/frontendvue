import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    // Mock user data. In a real app, this would come from a backend API.
    users: [
      { id: 1, name: 'Admin User', email: 'admin@test.com', password: 'password', role: 'admin' },
      { id: 2, name: 'Worker Bee', email: 'worker@test.com', password: 'password', role: 'worker' },
    ],
    // Initialize currentUser from localStorage to persist session
    currentUser: JSON.parse(localStorage.getItem('currentUser')) || null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.currentUser,
    /**
     * A getter to easily check if the current user is an admin.
     * This is useful for v-if directives in components.
     */
    isAdmin: (state) => state.currentUser?.role === 'admin',
  },
  actions: {
    /**
     * Simulates an async login API call.
     * @param {object} credentials - { email, password }
     */
    async login(credentials) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const user = this.users.find(
            (u) => u.email === credentials.email && u.password === credentials.password
          );

          if (user) {
            const userData = { id: user.id, name: user.name, email: user.email, role: user.role };
            this.currentUser = userData;
            localStorage.setItem('currentUser', JSON.stringify(userData));
            resolve(userData);
          } else {
            reject(new Error('Invalid email or password'));
          }
        }, 500); // Simulate network delay
      });
    },

    logout() {
      this.currentUser = null;
      localStorage.removeItem('currentUser');
    },

    /**
     * Simulates creating a user.
     * @param {object} user - { name, email, password, role }
     */
    async createUser(user) {
      const newUser = { id: Date.now(), ...user };
      this.users.push(newUser);
      // In a real app, you'd send this to your backend.
      return newUser;
    },
  },
});