export class DirectUserSelect {
  constructor(parent) {
    this.parent = parent
    this.render()
  }

  render() {
    if (!this.el) {
      this.el = document.createElement('label')
      this.el.innerHTML = /* html */ `
        user
        <select></select>
      `
      this.parent.append(this.el)
      this.select = this.el.children[0]
    }
  }

  fillUserNames(names=[]) {
    this.select.innerHTML = ['__ guest __', ...names]
      .map(name => `<option>${name}</option>`).join('')
  }

  check(userName) {
    this.select.value = userName
  }

  assignChangeHandler(cb) {
    this.select.onchange = () => cb(this.select.value)
  }
}
