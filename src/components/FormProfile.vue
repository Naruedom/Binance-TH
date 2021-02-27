<template>
  <v-dialog transition="dialog-top-transition" max-width="600" v-model="dialog">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        v-if="!user.apiKey"
        class="mr-5"
        color="blue"
        v-bind="attrs"
        v-on="on"
      >
        <v-icon left>mdi-account-edit</v-icon> API key
      </v-btn>
      <v-btn v-else class="mr-5" icon color="blue" v-bind="attrs" v-on="on">
        <v-icon>mdi-account-edit</v-icon>
      </v-btn>
    </template>
    <template v-slot:default="dialog">
      <v-card>
        <v-toolbar color="primary" dark>
          <div class="black--text">
            <v-icon color="black" left>mdi-account-edit</v-icon> Update API Key
          </div>
        </v-toolbar>
        <v-card-text class="pt-10 px-15">
          <v-text-field label="apiKey" outlined dense v-model="apiKey" />
          <v-text-field label="secretKey" outlined dense v-model="secretKey" />
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn
            class="mr-10 px-10"
            color="primary"
            @click="submitForm()"
            :loading="loading"
            :disabled="!apiKey || !secretKey"
            >Save</v-btn
          >
          <v-btn text @click="dialog.value = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script>
export default {
  data() {
    return {
      apiKey: "",
      secretKey: "",
      loading: false,
      dialog: false,
    };
  },
  computed: {
    auth() {
      return this.$store.getters.getUser;
    },
    user() {
      return this.$store.getters.getProfile;
    },
  },
  methods: {
    submitForm() {
      this.loading = true;
      this.$db
        .collection("users")
        .doc(this.auth.uid)
        .update({ apiKey: this.apiKey, secretKey: this.secretKey })
        .then(() => {
          this.apiKey = "";
          this.secretKey = "";
          this.$store.dispatch("updateProfileData");
          this.loading = false;
          this.dialog = false;
        });
    },
  },
};
</script>