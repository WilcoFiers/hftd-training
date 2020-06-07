import { auth } from "@/firebase";

// @ts-ignore
const getIsAdmin = store => store.user?.userData?.roles?.admin,

export default async (to: any, from: any, next: Function) => {
  const { currentUser } = auth;
  if (!currentUser) {
    return next("/sign-in");
  }
  const store = (await import('@/store')).default
  store.watch(getIsAdmin, (isAdmin) => {
    if (isAdmin) {
      next();
    } else {
      next('/');
    }
  }, { immediate: true })  
};
