// throw 'newer version was in dev-layers/presentation-layer/components'

export class SplitView {
  constructor (parent, options={}) {
    this.parent = parent
    this.props = {...splitViewDefaults, ...options}
    this.render()
    this.listen()
    this.updateLinks()
  }

  render() {
    if (!this.el) {
      this.el = document.createElement('splitview')
      this.el.innerHTML =
        '<section></section><splitter></splitter><section></section>'
      this.el.instance = this
    }
    this.parent.append(this.el)
    applyInlineStyling(this.el, this.props)
    this.moveSplitter()
  }

  listen() {
    const splitter = this.el.querySelector('splitter')

    splitter.onmousedown = ({altKey}) => {
      if (altKey) {
        this.el.querySelectorAll('splitview')
          .forEach(view => view.instance.rotate())
        return this.rotate()
      }
      this.el.onmousemove = ({x, y}) =>
        this.moveSplitter(this.props.direction.includes('row') ? x : y)
      this.el.onmouseleave = this.el.onmouseup =
        () => this.el.onmousemove = null
    }
  }

  moveSplitter(pos) {
    let [sect1,, sect2] = this.el.children
    const {direction, padding, gap} = this.props
    const sectionSpace = padding * -4 - gap +
      this.el['client' + (direction.includes("row") ? 'Width' : 'Height')]
    const startPos = padding + gap/2 + this.el.getBoundingClientRect()[direction.includes("row") ? 'left' : 'top']

    if (pos !== undefined) this.props.portion = (pos - startPos) / sectionSpace
    const part1 = Math.min(sectionSpace - 12,
      Math.max(12, sectionSpace * this.props.portion))
    if (pos !== undefined && this.props.direction.includes('reverse')) {
      [sect1, sect2] = [sect2, sect1]
      this.props.portion = 1 - this.props.portion
    }
    sect1.style.flex = part1
    sect2.style.flex = sectionSpace - part1
  }

  rotate() {
    this.props.direction = next(this.props.direction)
    applyInlineStyling(this.el, this.props)
    this.moveSplitter()
    this.updateLinks()
  }

  updateLinks() {
    ['top','left','right','bottom'].forEach(side => delete this[side+'Section'])
    const {children} = this.el
    switch (this.props.direction) {
      case 'row': return [this.leftSection,, this.rightSection] = children
      case 'column': return [this.topSection,, this.bottomSection] = children
      case 'row-reverse':
        return [this.rightSection,, this.leftSection] = children
      case 'column-reverse':
        return [this.bottomSection,, this.topSection] = children
    }
  }
}


const splitViewDefaults = {
  direction: 'row',  portion: 0.3,  padding: 6,  gap: 6,
  borderWidth: 1,  borderColor: 'gray',  borderRadius: 5,
}
const directions = ['row', 'column', 'row-reverse', 'column-reverse']

function next(direction) {
  return directions[(directions.indexOf(direction) + 1) % 4]
}

function applyInlineStyling(el, props) {
  const [sect1, splitter, sect2] = el.children
  const { direction, padding, gap,
          borderWidth, borderColor, borderRadius } = props
  Object.assign(el.style, {display: 'flex', flexDirection: direction,
    boxSizing: 'border-box', width: '100%', height: '100%'})
  Object.assign(splitter.style, {userSelect: 'none'},
    direction.startsWith("row")
      ? {width: gap + 'px', height: null, cursor: 'col-resize'}
      : {width: null, height: gap + 'px', cursor: 'row-resize'})
  for (const sect of [sect1, sect2])
    Object.assign(sect.style, {borderRadius: borderRadius + 'px',
      border: `${borderWidth}px solid ${borderColor}`, overflow: 'auto'})

  if (padding) el.style.padding = padding + 'px'
  else {
    [sect1, sect2].forEach(section => section.style.borderWidth = 0)
    if (direction == 'row') sect1.style.borderRightWidth =
      sect2.style.borderLeftWidth = borderWidth + 'px'
    else if (direction == 'column') sect1.style.borderBottomWidth =
      sect2.style.borderTopWidth = borderWidth + 'px'
    else if (direction == 'row-reverse') sect2.style.borderRightWidth =
      sect1.style.borderLeftWidth = borderWidth + 'px'
    else if (direction == 'column-reverse') sect2.style.borderBottomWidth =
      sect1.style.borderTopWidth = borderWidth + 'px'
  }
}
