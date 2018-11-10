<template>
  <v-app :dark="dark">
    <app-drawer />
    <app-toolbar />
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
    <app-settings />
    <v-footer fixed app>
      <span>&copy; 2017</span>
    </v-footer>
  </v-app>
</template>

<script>
import AppDrawer from './partials/AppDrawer'
import AppToolbar from './partials/AppToolbar'
import AppSettings from './partials/AppSettings'
import { mapState, mapMutations } from 'vuex'

export default {
  components: { AppDrawer, AppToolbar, AppSettings },
  mounted(){
    this.$vuetify.theme.primary = '#009688'
  },
  computed: {
    ...mapState('settings', [ 'clipped', 'drawer', 'dark', 'miniVariant', 'right', 'rightDrawer', 'title' ])
  },
}
</script>
