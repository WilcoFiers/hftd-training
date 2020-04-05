import Vue from "vue";
import VueRouter from "vue-router";
import AuthGuard from './AuthGuard'
import Home from "@/views/Home.vue";
import TrainingList from "@/views/TrainingList.vue";
import Training from "@/views/Training.vue";
import Credit from "@/views/Credit.vue";
// import ComingSoon from "@/views/ComingSoon.vue";

import { userRoutes } from './user'

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/trainings",
    name: "TrainingList",
    component: TrainingList,
    beforeEnter: AuthGuard
  },
  {
    path: "/trainings/:serverId",
    name: "Training",
    component: Training,
    beforeEnter: AuthGuard
  },
  {
    path: "/credit",
    name: "Credit",
    component: Credit,
    beforeEnter: AuthGuard
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue")
  },
  ...userRoutes,
];

const router = new VueRouter({
  routes
});

export default router;
