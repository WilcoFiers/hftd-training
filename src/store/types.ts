import { MutationTree, ActionTree, GetterTree } from "vuex";

export interface RootState {
  loading: boolean;
}

export interface RootModule<S> {
  state: S;
  mutations?: MutationTree<S>;
  actions?: ActionTree<S, RootState>;
  getters?: GetterTree<S, RootState>;
}

export interface Character {
  name: string;
}
