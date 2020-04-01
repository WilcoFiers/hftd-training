<template>
  <v-container>
    <v-row class="justify-center">
      <v-col :md="6">
        <v-form @submit.prevent="resetPassword" ref="form">
          <v-row>
            <h1>Reset Password</h1>
            <p>Lost your password? Send an e-mail to reset the password:</p>
          </v-row>
          <v-row>
            <v-text-field
              label="E-mail"
              v-model="email"
              :rules="[required, validEmail]"
            />
          </v-row>
          <v-row>
            <ErrorMessage :message="message" />
          </v-row>
          <v-row>
            <v-btn type="submit">Send e-mail</v-btn>
          </v-row>
          <v-row>
            <p class="py-5">
              Already have a password? You can
              <router-link to="/sign-in">sign in</router-link>. <br />Don't have
              an account, just
              <router-link to="/sign-up">Sign up</router-link>
            </p>
          </v-row>
        </v-form>
      </v-col>
    </v-row>

    <v-snackbar v-model="snackbar" color="primary" role="alert">
      An e-mail with a link to reset your password has been sent.
      <v-btn @click="snackbar = false" text>Close</v-btn>
    </v-snackbar>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { mapActions } from "vuex";
import ErrorMessage from "@/components/ErrorMessage.vue";

export default Vue.extend({
  name: "PasswordReset",
  components: { ErrorMessage },
  data() {
    return {
      email: "",
      message: "",
      snackbar: false,
      required: (val: string) => val !== "" || "Field must be filled out",
      validEmail: (val: string) =>
        /\S+@\S+\.\S+/.test(val) || "E-mail address must be valid"
    };
  },
  methods: {
    async resetPassword() {
      if (!this.form.validate()) {
        return;
      }
      try {
        await this.$store.dispatch("resetPassword", this.email);
        this.snackbar = true;
        // @ts-ignore
        this.form.reset();
      } catch (e) {
        this.message = e.message;
      }
    }
  },
  computed: {
    form(): Vue & { validate: () => boolean } {
      // Work around for $refs.form not having a validate method
      return this.$refs.form as Vue & { validate: () => boolean };
    }
  }
});
</script>
