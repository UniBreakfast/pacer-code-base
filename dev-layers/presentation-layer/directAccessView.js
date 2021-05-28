let parent

export const directAccessView = {

  setParent(el) {
    parent = el
  },

  get parent() {
    return parent
  },

  render() {
    const wrapper = document.createElement('div')
    parent.append(wrapper)
    wrapper.style.padding = '4px'

    const userSelect = new DirectUserSelect(wrapper)

    userSelect.fillUserNames(['Alex', 'Bob', 'Joshua'])
    userSelect.assignChangeHandler(console.log)
    userSelect.check('Bob')
  },
}


import {DirectUserSelect} from './components/DirectUserSelect.js'
