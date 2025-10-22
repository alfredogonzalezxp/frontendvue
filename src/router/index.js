import { createRouter, createWebHistory } from 'vue-router';
import BoardView from '@/views/BoardView.vue';
import LoginView from '@/views/LoginView.vue';
import NotAuthorizedView from '@/views/NotAuthorizedView.vue';
import UserManagementView from '@/views/UserManagementView.vue';
import UserEditView from '@/views/UserEditView.vue';
import { useUserStore } from '@/stores/userStore';

const routes = [
  {
    path: '/login',
    name: 'LoginView',
    component: LoginView,
  },
  {
    path: '/',
    name: 'BoardView',
    component: BoardView,
    meta: { requiresAuth: true },
  },
  {
    path: '/not-authorized',
    name: 'NotAuthorizedView',
    component: NotAuthorizedView,
  },
  {
    path: '/manage-users',
    name: 'manage-users',
    component: UserManagementView,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/edit-user/:id',
    name: 'edit-user',
    component: UserEditView,
    meta: { requiresAuth: true, requiresAdmin: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const userStore = useUserStore();

  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    next({ name: 'LoginView' });
  } else if (to.meta.requiresAdmin && !userStore.isAdmin) {
    next({ name: 'NotAuthorizedView' });
  } else {
    next();
  }
});

export default router;