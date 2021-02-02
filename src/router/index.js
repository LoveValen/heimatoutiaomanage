import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

const router = new VueRouter({

  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      name: 'login',
      path: '/login',
      component: () => import('@/views/Login.vue')
    },
    {
      name: 'index',
      path: '/index',
      component: () => import('@/views/index.vue'),
      redirect: { name: 'welcome' },
      children: [
        {
          name: 'welcome',
          path: 'welcome',
          component: () => import('@/views/Welcome.vue'),
        },
        {
          name: 'postlist',
          path: 'postlist',
          component: () => import('@/views/postList.vue'),
        }
      ],
    }
  ]
});

// 导航守卫
router.beforeEach((to, form, next) => {
  if (to.path == '/login') {
    next();
  } else {
    let token = localStorage.getItem('managetoken');
    if (token) {
      next();
    } else {
      next({ name: 'login' });
    }
  }
});

export default router;