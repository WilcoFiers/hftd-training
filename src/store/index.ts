import Vue from "vue";
import Vuex from "vuex";
import { RootState } from "./types";
import { user, UserState } from './user'
import { vuexfireMutations } from "vuexfire";
import { quantumServer } from './quantumServers'
import router from "@/router";

Vue.use(Vuex);

const defaultState: RootState = {
  loading: false
};

export interface State extends RootState {
  user: UserState;
}

Vue.use(Vuex);

const store = new Vuex.Store<RootState>({
  state: defaultState,
  modules: { user, quantumServer },

  mutations: {
    ...vuexfireMutations,
    setLoading: (state: RootState, val = true) => (state.loading = val)
  }
});

// Expose route change to the store
router.beforeEach((from, to, next) => {
  store.dispatch("routeChange", { from, to });
  next();
});

export default store;
