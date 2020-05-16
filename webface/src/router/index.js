import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/login",
    name: "login",
    meta: { layout: "main" },
    component: () => import("../views/Login.vue"),
  },
  {
    path: "/history",
    name: "history",
    meta: { layout: "main" },
    component: () => import("../views/History.vue"),
  },
  {
    path: "/detail/:id",
    name: "detail",
    meta: { layout: "main" },
    component: () => import("../views/detail.vue"),
  },
  {
    path: "/statistics/",
    name: "statistics",
    meta: { layout: "main" },
    component: () => import("../views/statistics.vue"),
  },
  {
    path: "/",
    name: "home",
    meta: { layout: "main" },
    component: () => import("../views/Home.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
