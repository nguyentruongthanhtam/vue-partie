import Vue from 'vue'
import Router from 'vue-router'
import Splash from '../Views/Splash.vue'
import Home from '../Views/Home.vue'
import About from '../Views/About.vue'
import Settings from '../Views/Settings.vue'
import Signup from '../Views/Signup.vue'
import Register from '../Views/Register.vue'
import Table from '../Views/Table.vue'
import NotFound from '../Views/NotFound.vue'
import store from '../store'
Vue.use(Router)

// export default new Router({
const router = new Router({
  routes: [
    {
      path: '/',
      name: 'splash',
      component: Splash,
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
      meta: {
        authOnly: true
      }
    },
    {
      path: '/about',
      name: 'about',
      component: About,

    },
    {
      path: '/settings',
      name: 'settings',
      component: Settings,
      meta: {
        authOnly: true
      }
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
      meta: {
        authOnly: true
      }
    },
    {
      path: '/signup',
      name: 'signup',
      component: Signup,
      meta: {
        authOnly: false
      }
    },
    {
      path: '/table',
      name: 'table',
      component: Table,
      meta: {
        authOnly: true
      }
    },
    {
      path: '/*',
      name: 'NotFound',
      component: NotFound
    }
  ],
  mode: 'history'
})
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.authOnly)) {
    if (!store.getters.IS_LOGGED) {
      next('/')
    }
    else {
      next()
    }
  }
  else
    next()
})
export default router
