let storage

export const pacerServer = {

  use(layers) {
    ({storage} = layers)
  },

  role: 'server',
}
