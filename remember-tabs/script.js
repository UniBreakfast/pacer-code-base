import {Tabs} from './Tabs.js'

const tabs1 = new Tabs(document.querySelector('body>tabs'), {
  active: [1, 3],
  side: 'top',
  id: 'level1',
  // className: 'sideway',
})
const tabs2 = new Tabs(document.querySelector('tab>tabs'), {
  active: [1, 4],
  side: 'left',
  id: 'level2',
  className: 'sideway',
})
const tabs3 = new Tabs(document.querySelector('tab>tabs'), {
  active: [2, 3],
  side: 'bottom',
  id: 'level3',
})
