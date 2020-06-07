import AdminGuard from './AdminGuard'

export const adminRoutes = [
  {
    path: "/admin/server-layout",
    name: "ServerLayout",
    component: () =>
      import(/* webpackChunkName: "admin" */ "@/views/admin/ServerLayout.vue"),
    beforeEnter: AdminGuard
  },
  {
    path: "/admin/threats",
    name: "Threats",
    component: () =>
      import(/* webpackChunkName: "admin" */ "@/views/admin/Threats.vue"),
    beforeEnter: AdminGuard
  }
]
