<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="9" md="8">
        <v-row>
          <v-col>
            <h1>Settings</h1>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-form
              @submit.prevent="updateProfile"
              autocomplete="off"
              ref="profileForm"
            >
              <v-card>
                <v-card-title class="pb-0">
                  <h2>Profile Information</h2>
                </v-card-title>
                <v-card-text>
                  <v-text-field
                    label="Display name"
                    v-model="displayName"
                    prepend-icon="mdi-monitor-screenshot"
                    type="text"
                    :rules="[required]"
                  />
                  <v-text-field
                    label="E-mail"
                    v-model="email"
                    prepend-icon="mdi-at"
                    type="text"
                    autocomplete="email"
                    :rules="[required, validEmail]"
                  />
                  <ErrorMessage :message="profileMessage" />
                  <v-btn type="submit" class="secondary">Update profile</v-btn>
                </v-card-text>
              </v-card>
            </v-form>
          </v-col>
        </v-row>

        <v-row class="mt-5">
          <v-col>
            <v-form @submit.prevent="updatePassword" ref="passwordForm">
              <v-card>
                <v-card-title class="pb-0">
                  <h2>Update password</h2>
                </v-card-title>
                <v-card-text>
                  <v-text-field
                    label="New password"
                    autocomplete="new-password"
                    hint="At least 6 characters"
                    persistent-hint
                    v-model="password"
                    type="password"
                    prepend-icon="mdi-lock-outline"
                    :rules="[required]"
                  />
                  <v-text-field
                    label="Repeat your new password"
                    autocomplete="new-password"
                    v-model="passwordRepeat"
                    type="password"
                    prepend-icon="mdi-lock-outline"
                    :rules="[required]"
                  />
                  <ErrorMessage :message="passwordMessage" />
                  <v-btn type="submit" class="secondary">Update password</v-btn>
                </v-card-text>
              </v-card>
            </v-form>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-dialog v-model="signInModal" max-width="600" :persistent="true">
      <v-form @submit.prevent="confirmSignIn" ref="signInForm">
        <v-card>
          <v-card-title>Confirm your password</v-card-title>
          <v-card-text>
            <v-text-field
              label="Password"
              v-model="signInPassword"
              type="password"
              prepend-icon="mdi-lock-outline"
              :error-messages="signInMessage"
              :rules="[required]"
            />
          </v-card-text>
          <v-card-actions>
            <v-btn @click="exitLogin">Cancel</v-btn>
            <v-spacer></v-spacer>
            <v-btn color="primary" type="submit">continue</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>

    <v-snackbar v-model="snackbar" color="primary" role="alert">
      {{ snackbarText }}
      <v-btn @click="snackbar = false" text>Close</v-btn>
    </v-snackbar>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import ErrorMessage from "@/components/ErrorMessage.vue";

const emailRegex = /\S+@\S+\.\S+/;

export default Vue.extend({
  name: "Account",
  components: { ErrorMessage },
  data() {
    const { displayName = "", email = "" } = this.$store.getters.currentUser;
    return {
      // Profile update stuff
      displayName,
      email,
      profileMessage: "",
      // Password update stuff
      password: "",
      passwordRepeat: "",
      passwordMessage: "",
      // Snackbar stuff
      snackbarText: "",
      snackbar: false,
      // signIn modal stuff
      signInPassword: "",
      signInMessage: "",
      signInAction: "",
      signInModal: false,
      required: (val: string) => val !== "" || "Field must be filled out",
      validEmail: (val: string) =>
        emailRegex.test(val) || "E-mail address must be valid"
    };
  },
  methods: {
    async updateProfile() {
      this.profileMessage = "";
      if (!this.profileForm.validate()) {
        return;
      }
      const { email, displayName } = this;
      try {
        await this.$store.dispatch("updateProfile", { email, displayName });
        this.snackbar = true;
        this.snackbarText = "Profile has been saved";
      } catch (e) {
        if (e.code === "auth/requires-recent-login") {
          this.signInModal = true;
          this.signInAction = "updateProfile";
        } else {
          this.profileMessage = e.message;
        }
      }
    },

    async updatePassword() {
      this.passwordMessage = "";
      if (!this.profileForm.validate()) {
        return;
      }
      const { password, passwordRepeat } = this;
      if (password !== passwordRepeat) {
        this.passwordMessage = "Password and repeat password must be the same.";
        return;
      }

      try {
        await this.$store.dispatch("updatePassword", password);
        this.snackbarText = "Password has been updated";
        this.snackbar = true;
        // @ts-ignore
        this.passwordForm.reset();
      } catch (e) {
        if (e.code === "auth/requires-recent-login") {
          this.signInModal = true;
          this.signInAction = "updatePassword";
        } else {
          this.passwordMessage = e.message;
        }
      }
    },

    exitLogin(noReset = false) {
      if (!noReset) {
        this.email = this.$store.getters.currentUser.email;
        this.password = "";
        this.passwordRepeat = "";
      }
      this.signInModal = false;
      this.signInMessage = "";
      this.signInPassword = "";
    },

    async confirmSignIn() {
      if (!this.signInForm.validate()) {
        return;
      }
      const password = this.signInPassword;
      try {
        await this.$store.dispatch("reauthenticate", password);
        if (
          this.signInAction !== "updateProfile" &&
          this.signInAction !== "updatePassword"
        ) {
          throw new Error(`Unknown signInAction ${this.signInAction}`);
        }
        await this[this.signInAction]();
        this.exitLogin(this.signInAction === "updateProfile");
      } catch (e) {
        this.signInMessage = "The password is invalid, please try again.";
      }
    }
  },

  computed: {
    profileForm(): Vue & { validate: () => boolean } {
      // Work around for $refs.form not having a validate method
      return this.$refs.profileForm as Vue & {
        validate: () => boolean;
      };
    },
    passwordForm(): Vue & { validate: () => boolean } {
      // Work around for $refs.form not having a validate method
      return this.$refs.passwordForm as Vue & {
        validate: () => boolean;
      };
    },
    signInForm(): Vue & { validate: () => boolean } {
      // Work around for $refs.form not having a validate method
      return this.$refs.signInForm as Vue & {
        validate: () => boolean;
      };
    }
  }
});
</script>

<style lang="scss" scoped></style>
