<template>
  <div class="text-xs-center">
    <v-dialog
      v-model="dialog"
      persistent
      no-click-animation
      width="300"
    >
      <v-card
        color="primary"
        dark
      >
        <v-card-text>
          Please stand by
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  data: () => ({
    dialog: false
  }),

  methods: {
    loading(){
      console.log(this.dialog)
      this.dialog = !this.dialog
      console.log(this.dialog)
    }
  }
}
</script>
