import Vue from 'vue';
import Router from 'vue-router';

const Dashboard = () => import('./views/Dashboard.vue');
const Playground = () => import('./views/Playground.vue');
const Development = () => import('./views/Development.vue');

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard,
    },
    {
      path: '/playground',
      name: 'playground',
      component: Playground,
    },
    {
      path: '/development',
      name: 'development',
      component: Development,
    },
  ],
});
