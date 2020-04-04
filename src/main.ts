import Vue from "vue";
import { auth } from "./firebase";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";

let app: Record<string, any>;
auth.onAuthStateChanged(user => {
  if (user) {
    store.dispatch("autoSignIn", user);
  }
  // Prevents mounting multiple times
  if (!app) {
    app = new Vue({
      router,
      store,
      vuetify,
      render: h => h(App),
    }).$mount("#app");
  }
});
