import AuthGuard from './AuthGuard'
import SignUp from "@/views/user/SignUp.vue";
import SignIn from "@/views/user/SignIn.vue";
import PasswordReset from "@/views/user/PasswordReset.vue";
import Settings from "@/views/user/Settings.vue";

export const userRoutes = [
  {
    path: "/sign-in",
    component: SignIn
  },
  {
    path: "/sign-up",
    component: SignUp
  },
  {
    path: "/password-reset",
    component: PasswordReset
  },
  {
    path: "/settings",
    name: "Settings",
    component: Settings,
    beforeEnter: AuthGuard
  }
];
