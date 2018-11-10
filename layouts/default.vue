<template>
  <v-app :dark="$vuetify.dark">
    <app-drawer />
    <app-toolbar />
    <v-content>
      <nuxt />
    </v-content>
    <!-- <app-settings /> -->
  </v-app>
</template>

<script>
import AppDrawer from './partials/AppDrawer'
import AppToolbar from './partials/AppToolbar'
// import AppSettings from './partials/AppSettings'

export default {
  components: { AppDrawer, AppToolbar },
}
</script>
