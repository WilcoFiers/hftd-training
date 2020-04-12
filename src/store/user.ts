import { auth, EmailAuthProvider, db, serverTimestamp } from "@/firebase";
import { firestoreAction } from "vuexfire";
import { RootModule } from "./types";
import { User } from '@/types'

export interface UserState {
  signedIn: boolean;
  displayName: string | undefined;
  userData: User | undefined
  uid: string | undefined
}

export type UserModules = RootModule<UserState>;

export const user: UserModules = {
  state: {
    signedIn: false,
    displayName: undefined,
    userData: undefined,
    uid: undefined
  },

  mutations: {
    signedIn: (state, val = true) => (state.signedIn = val),
    setUserProps: (state, { displayName, uid}) => {
      state.uid = uid
      state.displayName = displayName
    }
  },

  getters: {
    currentUser() {
      return auth.currentUser;
    }
  },

  actions: {
    async signUp({ dispatch }, { email, password, displayName }) {
      await auth.createUserWithEmailAndPassword(email, password);
      const user = auth.currentUser;
      if (!user) {
        throw new Error('Failed to set up user account')
      }
      user.updateProfile({ displayName });
      try {
        await db.doc(`users/${user.uid}`).set({
          createdAt: serverTimestamp(),
          lastUpdated: serverTimestamp(),
          credit: 10
        });
      } catch (e) {
        console.error(e)
      }

      await dispatch("emailSignIn", { email, password });
    },

    async emailSignIn({ commit, dispatch }, { email, password }) {
      await auth.signInWithEmailAndPassword(email, password);
      await dispatch("autoSignIn");
      commit("signedIn", true);

      dispatch("bindUserData");
    },

    async autoSignIn({ commit, dispatch }) {
      const user = auth.currentUser;
      if (user) {
        commit("setUserProps", user);
      }
      await dispatch("bindUserData");
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
    },

    bindUserData: firestoreAction((context) => {
      const userId = auth.currentUser?.uid
      if (!userId) {
        throw new TypeError('Unable to bind userData, user is not defined')
      }
      const ref =  db.doc(`users/${userId}`)
      return context.bindFirestoreRef('userData', ref);
    }),
  }
};
