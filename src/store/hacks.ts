import { auth, db, serverTimestamp } from "@/firebase";
import { RootModule } from "./types";
import { Hack, Server, Threat } from '@/qhack/types'
import { firestoreAction } from "vuexfire";

export interface HacksState {
  currentHack: null | Hack
  currentHackId?: string
  myHacks: Hack[]
  serverLayouts: Server[]
  threats: Threat[]
}

export type HacksModules = RootModule<HacksState>;

export const hacks: HacksModules = {
  state: {
    currentHack: null,
    currentHackId: undefined,
    myHacks: [],
    serverLayouts: [],
    threats: []
  },

  mutations: {
    setCurrentHackId(state, hackId) {
      state.currentHackId = hackId;
    },
  },

  getters: {
    hack({ currentHack }): Hack {
      return currentHack as Hack
    }},

  actions: {
    routeChange({ state, dispatch, commit}, { from }) {
      const hackId: string | undefined = from.params.hackId;
      if (!hackId || hackId === state.currentHackId) {
        return
      }
      commit('setCurrentHackId', hackId);
      dispatch("bindCurrentHack", hackId);
    },

    bindCurrentHack: firestoreAction((context, hackId) => {
      const ref =  db.doc(`hacks/${hackId}`)
      return context.bindFirestoreRef('currentHack', ref);
    }),

    bindHackList: firestoreAction(({ bindFirestoreRef }) => {
      if (!auth.currentUser) {
        throw new Error("Trying to load characters without sign-in");
      }
      const { uid } = auth.currentUser;
      const query = db.collection('hacks')
        .where("hostId", "==", uid)
        .orderBy("createdAt", "desc");
      return bindFirestoreRef("myHacks", query);
    }),

    bindServerLayoutList: firestoreAction(({ bindFirestoreRef }) => {
      const query = db.collection('serverLayouts')
      return bindFirestoreRef("serverLayouts", query);
    }),

    bindThreatList: firestoreAction(({ bindFirestoreRef }) => {
      const query = db.collection('threats')
      return bindFirestoreRef("threats", query);
    }),

    unbindHackList: firestoreAction(({ unbindFirestoreRef }) => {
      unbindFirestoreRef("myHacks");
    }),

    async createHack(_, hack: Hack) {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('Unable to create a quantum computer. User is not signed in')
      }
      const hackData = await db.collection('hacks').add({
        ...hack,
        createdAt: serverTimestamp(),
        hostId: user.uid,
      })

      return hackData.id
    },

    createServerLayout(_, server: Server) {
      db.collection('serverLayouts').add(server)
    },

    updateServerLayout(_, server: Server & { id: number }) {
      const serverId = server.id
      server = { ...server }
      delete server.id
      db.doc(`serverLayouts/${serverId}`).update(server)
    },

    createThreat(_, threat: Threat) {
      db.collection('threats').add(threat)
    },

    updateThreat(_, threat: Threat & { id: number }) {
      const threatId = threat.id
      threat = { ...threat }
      delete threat.id
      db.doc(`threats/${threatId}`).update(threat)
    }
  }
};
