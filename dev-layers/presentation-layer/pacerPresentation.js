let parent

export const pacerPresentation = {

  setParent(el) {
    parent = el
  },

  get parent() {
    return parent
  },

  role: 'presentation',
}
