
// Navigation Guard
router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  console.log('Router Guard:', { to: to.path, isAuthenticated: userStore.isAuthenticated, isAdmin: userStore.isAdmin, currentUser: userStore.currentUser });
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin);

  if (requiresAuth && !userStore.isAuthenticated) {
    next({ name: 'login' });
  } else if (requiresAdmin && !userStore.isAdmin) {
    alert('You do not have permission to access this page.');
    next({ name: 'home' });
  } else if (to.name === 'login' && userStore.isAuthenticated) {
    // Redirect away from login if already authenticated
    next({ name: 'home' });
  } else {
    next();
  }
});

export default router;
