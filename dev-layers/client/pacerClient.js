let presentation, clerk

export const pacerClient = {

  use(layers) {
    ({presentation, clerk} = layers)
  },

  run() {
    console.log('pacer client is now running...')
    console.log('with', {presentation, clerk});
  },


}
