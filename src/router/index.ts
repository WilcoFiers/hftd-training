import Vue from "vue";
import VueRouter from "vue-router";
import AuthGuard from './AuthGuard'
import Home from "@/views/Home.vue";
import TrainingList from "@/views/TrainingList.vue";
import Training from "@/views/Training.vue";
import MyHacks from "@/views/MyHacks.vue";
import CreateAAR from "@/views/CreateAAR.vue";
import Hack from "@/views/Hack.vue";
import Credit from "@/views/Credit.vue";


import { userRoutes } from './user'
import { adminRoutes } from './admin'

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
    path: "/hacks",
    name: "MyHacks",
    component: MyHacks,
    beforeEnter: AuthGuard
  },
  {
    path: "/create-aar",
    name: "CreateAAR",
    component: CreateAAR,
    beforeEnter: AuthGuard
  },
  {
    path: "/hacks/:hackId",
    name: "Hack",
    component: Hack,
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
  ...adminRoutes,
];

const router = new VueRouter({
  routes
});

export default router;
