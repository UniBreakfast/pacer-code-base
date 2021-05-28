import {splitBody} from './preparePage.js'

import {pacerPresentation} from './presentation-layer/pacerPresentation.js'
import {pacerClient} from './client/pacerClient.js'
import {pacerClerk} from './clerk-layer/pacerClerk.js'
import {pacerServer} from './server-layer/pacerServer.js'
import {pacerStorage} from './storage-layer/pacerStorage.js'

import {directAccessView} from './presentation-layer/directAccessView.js'


pacerPresentation.setParent(splitBody.section1)
directAccessView.setParent(splitBody.section2)

pacerClient.use({
  presentation: pacerPresentation,
  clerk: pacerClerk,
})

pacerClerk.use({
  server: pacerServer,
})

pacerServer.use({
  storage: pacerStorage,
})

pacerClient.run()

directAccessView.render()
