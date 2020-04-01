import { auth, EmailAuthProvider } from "@/firebase";
import { RootModule } from "./types";

export interface UserState {
  signedIn: boolean;
  displayName: string | null;
}

export type UserModules = RootModule<UserState>;

export const user: UserModules = {
  state: {
    signedIn: false,
    displayName: null
  },

  mutations: {
    signedIn: (state, val = true) => (state.signedIn = val),
    setDisplayName: (state, val) => (state.displayName = val)
  },

  getters: {
    currentUser() {
      return auth.currentUser;
    }
  },

  actions: {
    async signUp({ dispatch }, { email, password, displayName }) {
      await auth.createUserWithEmailAndPassword(email, password);
      await dispatch("emailSignIn", { email, password });
      const user = auth.currentUser;
      if (user) {
        user.updateProfile({ displayName });
      }
    },

    async emailSignIn({ commit, dispatch }, { email, password }) {
      await auth.signInWithEmailAndPassword(email, password);
      await dispatch("autoSignIn");

      dispatch("bindCharacterList");
      commit("signedIn", true);
    },

    async autoSignIn({ commit, dispatch }) {
      const user = auth.currentUser;
      if (user) {
        commit("setDisplayName", user.displayName);
      }
      await dispatch("bindCharacterList");
      commit("signedIn", true);
    },

    signOut({ commit }) {
      auth.signOut();
      commit("signedIn", false);
    },

    updateProfile(_, { displayName, email }) {
      const promises = [];
      const user = auth.currentUser;
      if (!user) {
        throw new Error("Can not locate user to update the profile for.");
      }
      if (displayName) {
        promises.push(user.updateProfile({ displayName }));
      }
      if (email) {
        promises.push(user.updateEmail(email));
      }
      return Promise.all(promises);
    },

    updatePassword(_, newPassword) {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("Can not locate user to reset password for.");
      }
      return user.updatePassword(newPassword);
    },

    reauthenticate(_, password: string) {
      const user = auth.currentUser;
      if (!user || !user.email) {
        throw new Error("No user to reauthenticate.");
      }
      const credential = EmailAuthProvider.credential(user.email, password);
      return user.reauthenticateWithCredential(credential);
    },

    resetPassword(_, email) {
      return auth.sendPasswordResetEmail(email);
    }
  }
};
