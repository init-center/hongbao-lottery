import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Home from "../views/Home.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/guide",
    name: "Guide",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "guide" */ "../views/Guide.vue")
  },
  {
    path: "/records",
    name: "Records",
    component: () =>
      import(/* webpackChunkName: "records" */ "../views/Records.vue")
  },
  {
    path: "/admin",
    name: "Admin",
    component: () =>
      import(/* webpackChunkName: "admin" */ "../views/Admin.vue")
  },
  {
    path: "/login",
    name: "Login",
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/Login.vue")
  },
  {
    path: "/change_password",
    name: "ChangePassword",
    component: () =>
      import(
        /* webpackChunkName: "change_password" */ "../views/ChangePassword.vue"
      )
  },
  {
    path: "/admin/prizes",
    name: "AdminPrizes",
    component: () =>
      import(/* webpackChunkName: "admin_prizes" */ "../views/admin/Prizes.vue")
  },
  {
    path: "/admin/draw_count",
    name: "AdminDrawCount",
    component: () =>
      import(
        /* webpackChunkName: "admin_draw_count" */ "../views/admin/DrawCount.vue"
      )
  },
  {
    path: "/admin/administrators",
    name: "AdminAdministrators",
    component: () =>
      import(
        /* webpackChunkName: "admin_administrators" */ "../views/admin/Administrators.vue"
      )
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
