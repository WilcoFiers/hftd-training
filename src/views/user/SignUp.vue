<template>
  <v-container>
    <v-row class="justify-center">
      <v-col :md="6">
        <h1>Sign Up</h1>
        <v-form @submit.prevent="signUp" autocomplete="off" ref="form">
          <v-row v-if="message">
            <ErrorMessage :message="message" />
          </v-row>

          <v-row>
            <v-text-field
              label="Display name"
              v-model="displayName"
              prepend-icon="mdi-monitor-screenshot"
              :rules="[required]"
            />
          </v-row>

          <v-row>
            <v-text-field
              label="E-mail"
              v-model="email"
              prepend-icon="mdi-at"
              :rules="[required, validEmail]"
            />
          </v-row>

          <v-row>
            <v-text-field
              label="Password"
              hint="At least 6 characters"
              persistent-hint
              v-model="password"
              type="password"
              prepend-icon="mdi-lock-outline"
              autocomplete="new-password"
              :rules="[required]"
            />
          </v-row>

          <v-row>
            <v-text-field
              label="Repeat your password"
              v-model="passwordRepeat"
              type="password"
              prepend-icon="mdi-lock-outline"
              autocomplete="new-password"
              :rules="[required]"
            />
          </v-row>

          <v-row>
            <v-btn type="submit">Sign Up</v-btn>
          </v-row>

          <v-row>
            <p class="py-5">
              Already have an account, just
              <router-link to="/sign-in">Sign in</router-link>
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

const emailRegex = /\S+@\S+\.\S+/;

export default Vue.extend({
  name: "SignUp",
  components: { ErrorMessage },
  data() {
    return {
      displayName: "",
      realName: "",
      email: "",
      password: "",
      passwordRepeat: "",
      message: "",
      required: (val: string) => val !== "" || "Field must be filled out",
      validEmail: (val: string) =>
        emailRegex.test(val) || "E-mail address must be valid"
    };
  },
  methods: {
    async signUp() {
      if (!this.form.validate()) {
        return;
      }
      const { email, password, passwordRepeat, displayName, realName } = this;
      if (password !== passwordRepeat) {
        this.message = "Password and repeat password must be the same.";
        return;
      }

      try {
        await this.$store.dispatch("signUp", {
          email,
          password,
          displayName,
          realName
        });
        this.$router.push("/");
      } catch (e) {
        this.message = e.meaage;
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
