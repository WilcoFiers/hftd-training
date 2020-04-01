import { auth } from "@/firebase";

export default (to: any, from: any, next: Function) => {
  const { currentUser } = auth;
  if (!currentUser) {
    next("/sign-in");
  } else {
    next();
  }
};
