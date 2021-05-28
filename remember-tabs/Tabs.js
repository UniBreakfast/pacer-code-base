export class Tabs {
  constructor (tabs=[], {active=0, side='top', id, classes, className}={}) {
    if (Array.isArray(tabs)) {
      this.titles = tabs
    } else if (tabs instanceof HTMLElement) {
      this.tabs = tabs
      this.titles = [...tabs.children].map(({title}, i) => title || 'tab '+i)
    }
    this.render()
    this.assignHandlers()
    this.tabgroup.setAttribute('side', side)
    this.goTo(...[active].flat())

    if (id) this.tabgroup.id = id
    if (className) this.tabgroup.className = className
    if (classes) this.tabgroup.classList.add(...classes)
  }

  render() {
    const tabgroup = document.createElement('tabgroup')
    tabgroup.innerHTML = `
      <tabbuttons>
        ${ this.titles.map(t => `<button><span>${t}</span></button>`).join('') }
      </tabbuttons>
      ${ this.tabs ? '' : `
      <tabs>
        <div>${ `<tab hidden></tab>`.repeat(this.titles.length) }</div>
      </tabs>
      `}
    `
    if (this.tabs) {
      if (this.tabs.parentElement) this.tabs.replaceWith(tabgroup)
      tabgroup.append(this.tabs)
      const div = document.createElement('div')
      div.append(...this.tabs.children)
      this.tabs.append(div)
    }
    const tabbuttons = [...tabgroup.children[0].children]
    const tabs = [...tabgroup.children[1].children[0].children]
    tabs.forEach(tab => tab.removeAttribute('title'))

    Object.assign(this, {tabgroup, tabbuttons, tabs})
  }

  assignHandlers() {
    const [tabbuttons, tabs] = this.tabgroup.children
    tabbuttons.addEventListener('click', ({target, ctrlKey}) => {
      if (target == tabbuttons) return
      const index = this.tabbuttons.indexOf(target)
      if (ctrlKey)
        this.tabs[index].hidden ? this.goToo(index) : this.leave(index)
      else this.goTo(index)
      target.blur()
    })
    const div = tabs.children[0]
    div.addEventListener('mousedown', (e) => {
      if (e.target == div) this.beginResize(e[this.getAxis().main])
    })
  }

  goTo(...indices) {
    this.dropBasis()
    const [index, ...rest] = indices
    this.tabbuttons.forEach((btn, i) => {
      btn.disabled = i==index
      btn.removeAttribute('active')
    })
    this.tabs.forEach((tab, i) => tab.hidden = i!=index)
    if (rest.length) rest.forEach(index => this.goToo(index))
  }

  goToo(index) {
    this.dropBasis()
    const tab = this.tabs[index]
    if (!tab.hidden) return
    tab.hidden = false

    const disabledBtn = this.tabbuttons.find(btn => btn.disabled)
    if (disabledBtn) {
      disabledBtn.setAttribute('active', '')
      disabledBtn.disabled = false
    }
    this.tabbuttons[index].setAttribute('active', '')
  }

  leave(index) {
    this.dropBasis()
    const tab = this.tabs[index]
    if (tab.hidden || this.tabbuttons.find(btn => btn.disabled)) return

    const activeBtns = this.tabbuttons.filter(btn => btn.hasAttribute('active'))
    if (activeBtns.length == 2) {
      this.goTo(this.tabbuttons.findIndex((btn, i) =>
        i!=index && btn.hasAttribute('active')))
    } else {
      tab.hidden = true
      this.tabbuttons[index].removeAttribute('active')
    }
  }

  split(...portions) {
    this.tabs.filter(tab => !tab.hidden).forEach((tab, i) => tab.style.flexBasis = portions[i]+'%')
  }

  shiftSplit(index, shift) {
    const tabsToResize = [this.tabs[index],
      this.tabs.slice(index+1).find(tab => !tab.hidden)]
    const tabsToSaveSize =
      this.tabs.filter(tab => !tab.hidden && !tabsToResize.includes(tab))

    const {mainSize, cross, crossSize, crossScroll} = this.getAxis()

    const resizeValues =
      [tabsToResize[0][mainSize] + shift, tabsToResize[1][mainSize] - shift]
    const sizeValues = tabsToSaveSize.map(tab => tab[mainSize])

    tabsToResize.map((tab, i) => tab.style.flexBasis = resizeValues[i]+'px')
    tabsToSaveSize.map((tab, i) => tab.style.flexBasis = sizeValues[i]+'px')

    const tabs = tabsToResize.concat(tabsToSaveSize)
    if (tabs.some(tab => tab[crossScroll] > tab[crossSize]))
      tabs.forEach(tab => tab.style['overflow'+cross.toUpperCase()] = 'scroll')
    else tabs.forEach(tab => tab.style['overflow'+cross.toUpperCase()] = null)
  }

  dropBasis() {
    const overflowCross = 'overflow'+this.getAxis().cross.toUpperCase()
    this.tabs.forEach(tab => {
      tab.style.flexBasis = null
      tab.style[overflowCross] = null
    })
  }

  beginResize(coord) {
    const {main, cross, mainSide, crossSide} = this.getAxis()
    let tabs = this.tabs.filter(tab => !tab.hidden)
    let index =
      tabs.findIndex(tab => tab.getBoundingClientRect()[main] >= coord)
    tabs = tabs.slice(index - 1, index + 1)
    index = this.tabs.indexOf(tabs[0])

    const handleMove = e => {
      const rects = tabs.map(tab => tab.getBoundingClientRect())
      if (e[cross] < rects[0][cross] ||
          e[cross] > rects[0][cross] + rects[0][crossSide]) stopResize()
      else if (e[main] >= rects[0][main] + rects[0][mainSide] &&
               e[main] <= rects[1][main]) return
      else if (e[main] <= rects[0][main] + 5)
        this.leave(this.tabs.indexOf(tabs[0])),  stopResize()
      else if (e[main] >= rects[1][main] + rects[1][mainSide] - 5)
        this.leave(this.tabs.indexOf(tabs[1])),  stopResize()
      else if (e[main] > rects[1][main])
        this.shiftSplit(index, e[main] - rects[1][main])
      else this.shiftSplit(index, e[main] - rects[0][main] - rects[0][mainSide])
    }
    const stopResize = () => {
      tabs.forEach(tab => tab.style.pointerEvents = null)
      body.style.userSelect = null
      body.removeEventListener('mousemove', handleMove)
      body.removeEventListener('mouseup', stopResize)
    }
    const {body} = document
    tabs.forEach(tab => tab.style.pointerEvents = 'none')
    body.style.userSelect = 'none'
    body.addEventListener('mousemove', handleMove)
    body.addEventListener('mouseup', stopResize)
  }

  beginMove(index) {

  }

  getAxis() {
    return ['left', 'right'].includes(this.tabgroup.getAttribute('side'))
      ? {main: 'y', cross: 'x', mainSide: 'height', crossSide: 'width',
      mainSize: 'clientHeight', crossSize: 'clientWidth',
      mainScroll: 'scrollHeight', crossScroll: 'scrollWidth'}
      : {main: 'x', cross: 'y', mainSide: 'width', crossSide: 'height',
      mainSize: 'clientWidth', crossSize: 'clientHeight',
      mainScroll: 'scrollWidth', crossScroll: 'scrollHeight'}
  }
}
