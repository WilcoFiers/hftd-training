import Vue from "vue";
import Vuetify from "vuetify/lib";

Vue.use(Vuetify);

export default new Vuetify({
  // @ts-ignore 
  theme: {
    dark: true,
    themes: {
      dark: {
        primary: '#ff2020',
        secondary: '#a00000'
      }
    }
  }
});
