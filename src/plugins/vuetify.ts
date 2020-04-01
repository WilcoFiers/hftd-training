import Vue from "vue";
import Vuetify from "vuetify/lib";

Vue.use(Vuetify);

export default new Vuetify({
  // @ts-ignore 
  theme: {
    dark: true,
    themes: {
      dark: {
        primary: '#ff0000',
        secondary: '#a00000'
      }
    }
    // themes: {
    //   light: {
      //     primary: colors.red.darken1, // #E53935
      //     secondary: colors.red.lighten4, // #FFCDD2
      //     accent: colors.indigo.base, // #3F51B5
      //   },
      // }
  }
});
