import { defineStore } from 'pinia';
import { jwtDecode } from 'jwt-decode';

const API_URL = 'http://localhost:8080/api';

/**
 * Helper to create a headers object with the JWT token if it exists.
 * @returns {HeadersInit}
 */
function createAuthHeaders() {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

/**
 * Decodes the JWT token and extracts user information.
 * @param {string} token
 * @returns {{id: string, name: string, email: string, role: string} | null}
 */
function getUserFromToken(token) {
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    return {
      id: decoded.id,
      email: decoded.sub,
      role: decoded.role,
      name: decoded.name || 'User', // Example: add name to token
    };
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [],
    // Initialize user state from the token in localStorage on store creation
    currentUser: (() => {
      const token = localStorage.getItem('token');
      return getUserFromToken(token);
    })(),
    token: localStorage.getItem('token') || null,
    searchQuery: '',
    showCreateUserModal: false,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
    /**
     * A getter to easily check if the current user is an admin.
     * This is useful for v-if directives in components.
     */
    isAdmin: (state) => state.currentUser?.role === 'ADMIN',
  },
  actions: {
    /**
     * Fetches users from the backend.
     */
    async fetchUsers() {
      if (!this.isAuthenticated) return; // Don't fetch if not logged in
      try {
        const response = await fetch(`${API_URL}/users`, {
          headers: createAuthHeaders(),
        });
        if (!response.ok) throw new Error('Failed to fetch users');
        this.users = await response.json();
      } catch (error) {
        console.error('Error fetching users:', error);
        // Handle error appropriately in a real app (e.g., show a notification)
      }
    },

    /**
     * Performs a login API call to the backend.
     * @param {object} credentials - { email, password }
     */
    async login(credentials) {
      try {
        const response = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || 'Invalid email or password');
        }

        const { token, ...user } = await response.json();
        this.token = token;
        localStorage.setItem('token', token);
        this.currentUser = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role ? user.role.toUpperCase() : 'WORKER'
        };
        return true;
      } catch (error) {
        this.logout(); // Ensure clean state on error
        throw error; // Re-throw for the component to handle
      }
    },

    logout() {
      // Also remove the user from the local list to avoid showing stale data
      if (this.currentUser) {
        const index = this.users.findIndex(u => u.id === this.currentUser.id);
        if (index !== -1) this.users.splice(index, 1);
      }

      this.currentUser = null;
      this.token = null;
      localStorage.removeItem('currentUser');
      localStorage.removeItem('token'); // Ensure token is cleared on logout
    },

    /**
     * Simulates creating a user.
     * @param {object} user - { name, email, password, role }
     */
    async createUser(user) {
      try {
        const response = await fetch(`${API_URL}/users`, {
          method: 'POST',
          headers: createAuthHeaders(),
          body: JSON.stringify(user),
        });
        if (!response.ok) throw new Error('Failed to create user');
        const newUser = await response.json();
        this.users.push(newUser);
        return newUser;
      } catch (error) {
        console.error('Error creating user:', error);
        // Handle error
      }
    },

    /**
     * Fetches a single user by ID.
     * @param {string} userId
     * @returns {Promise<object|null>}
     */
    async fetchUserById(userId) {
      try {
        const response = await fetch(`${API_URL}/users/${userId}`, {
          headers: createAuthHeaders(),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
      } catch (error) {
        console.error(`Error fetching user ${userId}:`, error);
        return null;
      }
    },

    /**
     * Updates a user's details.
     * @param {string} userId
     * @param {object} userData - { name, email, role, password? }
     */
    async updateUser(userId, userData) {
      const response = await fetch(`${API_URL}/users/${userId}`, {
        method: 'PUT',
        headers: createAuthHeaders(),
        body: JSON.stringify(userData),
      });
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Failed to update user: ${errorData}`);
      }
      await this.fetchUsers(); // Refresh the user list
    },

    /**
     * Deletes a user.
     * @param {string} userId
     */
    async deleteUser(userId) {
      const response = await fetch(`${API_URL}/users/${userId}`, { method: 'DELETE', headers: createAuthHeaders() });
      alert(API_URL);
      if (!response.ok) {
        const errorText = await response.text();
        try {
          const errorData = JSON.parse(errorText);
          // Use the specific message from the backend
          throw new Error(errorData.message || `Failed to delete user: ${response.statusText}`);
        } catch (e) {
          // Fallback if the response is not JSON or is empty
          throw new Error(errorText || `Failed to delete user: ${response.statusText}`);
        }
      }
      // Only update the local state if the API call was successful
      this.users = this.users.filter(u => u.id !== userId);
    }
  },
});