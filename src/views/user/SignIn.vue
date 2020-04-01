<template>
  <v-container>
    <v-row class="justify-center">
      <v-col :md="6">
        <v-form @submit.prevent="signIn" ref="form">
          <h1>Sign In</h1>
          <v-row>
            <v-text-field
              label="E-mail"
              v-model="email"
              :rules="[required, validEmail]"
            />
          </v-row>

          <v-row>
            <v-text-field
              label="Password"
              v-model="password"
              type="password"
              :rules="[required]"
            />
          </v-row>

          <v-row v-if="message">
            <ErrorMessage :message="message" />
          </v-row>
          <v-row>
            <v-btn type="submit">Sign in</v-btn>
          </v-row>

          <v-row>
            <p class="py-5">
              Unable to sign in? You can
              <router-link to="/password-reset"
                >request a new password</router-link
              >. <br />Don't have an account, just
              <router-link to="/sign-up">Sign up</router-link>.
            </p>
          </v-row>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import ErrorMessage from "@/components/ErrorMessage.vue";

export default Vue.extend({
  name: "SignIn",
  components: { ErrorMessage },
  data() {
    return {
      email: "",
      password: "",
      message: "",
      required: (val: string) => val !== "" || "Field must be filled out",
      validEmail: (val: string) =>
        /\S+@\S+\.\S+/.test(val) || "E-mail address must be valid"
    };
  },
  methods: {
    async signIn() {
      if (!this.form.validate()) {
        return;
      }
      const { email, password } = this;
      try {
        await this.$store.dispatch("emailSignIn", { email, password });
        this.$router.push("/");
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
