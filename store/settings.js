export const state = () => ({
  clipped: false,
  drawer: true,
  miniVariant: false,
  rightDrawer: false,
})

export const mutations = {
  setClipped(state){
    state.clipped = !state.clipped
  },
  setDrawer(state){
    state.drawer = !state.drawer
  },
  setMiniVariant(state){
    state.miniVariant = !state.miniVariant
  },
  setRight(state){
    state.right = !state.right
  },
  setRightDrawer(state){
    state.rightDrawer = !state.rightDrawer
  }
}