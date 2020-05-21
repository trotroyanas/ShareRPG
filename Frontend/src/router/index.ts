import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

import Home from '../views/Home.vue'
import Contact from '../views/Contact.vue'
import Account from '../views/account.vue'
import Login from '../views/login.vue'


Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/contact',
    name: 'Contact',
    component: Contact
  }
  ,
  {
    path: '/account',
    name: 'Account',
    component: Account
  }
  ,
  {
    path: '/login',
    name: 'Login',
    component: Login
  }

]

const router = new VueRouter({
  routes
})

export default router
