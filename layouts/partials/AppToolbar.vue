<template>
  <v-toolbar :clipped-left="clipped" fixed app color="primary" dark>
    <v-toolbar-side-icon @click="setDrawer" />
    <v-btn icon @click.stop="setMiniVariant">
      <v-icon v-html="miniVariant ? 'chevron_right' : 'chevron_left'" />
    </v-btn>
    <v-btn icon @click.stop="setClipped">
      <v-icon>web</v-icon>
    </v-btn>
    <v-btn icon @click.stop="$vuetify.dark = ! $vuetify.dark">
      <v-icon v-html="$vuetify.dark ? 'brightness_3' : 'wb_sunny'" />
    </v-btn>
    <!-- <v-btn icon @click="setRightDrawer">
      <v-icon>settings</v-icon>
    </v-btn> -->
  </v-toolbar>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  computed: {
    ...mapState('settings', [ 'clipped', 'miniVariant' ])
  },
  methods: {
    ...mapMutations('settings', [ 'setClipped', 'setDrawer', 'setMiniVariant' ])
  }
}
</script>
