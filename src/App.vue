<template>
  <v-app>
    <v-main>
      <v-container class="App" :fill-height="false" fluid>
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  data: () => ({ }),
};
</script>
