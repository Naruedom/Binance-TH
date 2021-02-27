<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-btn tile color="primary" type="button" :disabled="loading" @click="loginGoogle">Login Google</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  computed: {
    loading () {
      return this.$store.getters.getLoading
    }
  },
  methods: {
    loginGoogle () {
      this.$store.dispatch('userLoginGoogle')
    }
  }
}
</script>