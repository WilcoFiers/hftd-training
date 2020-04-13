import { auth, db, serverTimeRef, serverTimestamp } from "@/firebase";
import { QuantumServer, Player } from '@/quantum-hack/types'
import { getServer } from '@/quantum-hack/server'
import { RootModule } from "./types";
import { firestoreAction } from "vuexfire";
import { prepareFirestoreData } from './utils'

export interface QuantumServerState {
  currentServer: null | QuantumServer 
  currentServerId?: string
  serverTimeOffset: number
  currentPlayers: Player[]
}

export type QuantumServerModules = RootModule<QuantumServerState>;

export const quantumServer: QuantumServerModules = {
  state: {
    currentServer: null,
    currentServerId: undefined,
    currentPlayers: [],
    serverTimeOffset: 0,
  },

  mutations: {
    setCurrentServerId(state, automataId) {
      state.currentServerId = automataId;
    },
    setServerTimeOffset(state, serverTimeOffset) {
      state.serverTimeOffset = serverTimeOffset
    }
  },

  getters: {
    quantumServer({ currentServer, currentPlayers }): QuantumServer {
      if (!currentServer) {
        return { ...getServer("loading...") }
      }
      return {
        ...currentServer,
        players: currentPlayers.map(player => {
          return {
            id: player.id,
            ...player
          }
        })
      }
    }
  },

  actions: {
    routeChange({ state, dispatch, commit}, { from }) {
      const serverId: string | undefined = from.params.serverId;
      if (serverId && serverId !== state.currentServerId) {
        commit('setCurrentServerId', serverId);
        dispatch("bindCurrentServer", serverId);
        dispatch("bindCurrentServerPlayers", serverId);
        dispatch("updateServerTimeOffset");
      }
    },

    bindCurrentServer: firestoreAction((context, serverId) => {
      const ref =  db.doc(`quantumServers/${serverId}`)
      return context.bindFirestoreRef('currentServer', ref);
    }),

    bindCurrentServerPlayers: firestoreAction((context, serverId) => {
      const ref =  db.collection(`quantumServers/${serverId}/players`)
        .orderBy("joined", "asc");

      return context.bindFirestoreRef('currentPlayers', ref);
    }),

    updateServerTimeOffset({ commit }) {
      serverTimeRef.on("value", snap => {
        commit('setServerTimeOffset', snap.val());
      });
    },

    async createQuantumServer(_, quantumServer: QuantumServer) {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('Unable to create a quantum computer. User is not signed in')
      }

      const serverData = await db.collection('quantumServers').add({
        ...quantumServer,
        hostId: user.uid,
      })
      return serverData.id
    },

    updateQuantumServer({ state }, serverUpdate: Partial<QuantumServer>) {
      const data = prepareFirestoreData(serverUpdate)
      const ref = db.doc(`quantumServers/${state.currentServerId}`)
      return ref.update(data)
    },

    initiateServerScan({ state }) {
      const ref = db.doc(`quantumServers/${state.currentServerId}`)
      return ref.update({
        startTime: serverTimestamp()
      })
    },

    runQuantumHack({ state }, playerId: string) {
      const ref = db.doc(`quantumServers/${state.currentServerId}`)
      if (!state.currentServer) {
        throw new Error('No current server found')
      }
      const players = (state.currentServer.players || []).map(player => {
        if (player.id !== playerId) {
          return player
        }
        return {
          runTime: serverTimestamp(),
          ...player
        }
      })
      return ref.update({ players })
    },

    updateServerPlayer({ state }, serverPlayerUpdate) {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('Unable to create a quantum computer. User is not signed in')
      }
      const data = prepareFirestoreData(serverPlayerUpdate)
      const docRef = db.doc(`quantumServers/${state.currentServerId}/players/${user.uid}`)

      if (state.currentPlayers.every(player => player.id !== user.uid)) {
        return docRef.set(data)
      } else {
        return docRef.update(data)
      }
    },

    deleteServerPlayer({ state }) {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('Unable to create a quantum computer. User is not signed in')
      }
      const docRef = db.doc(`quantumServers/${state.currentServerId}/players/${user.uid}`)
      return docRef.delete()
    }
  }
};
