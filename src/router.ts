import Vue from 'vue';
import Router from 'vue-router';

const Dashboard = () => import('./views/Dashboard.vue');

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
  ],
});
