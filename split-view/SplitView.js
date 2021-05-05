export class SplitView {
  constructor (parent, options={}) {
    this.parent = parent
    this.props = {...splitViewDefaults, ...options}
    this.render()
    this.listen()
    this.updateLinks()
  }

  render() {
    if (!this.el) this.el = buildSplitView(this.props.direction)
    this.parent.append(this.el)
    applyInlineStyling(this.el, this.props)
    this.moveSplitter()
  }

  listen() {
    const splitter = this.el.querySelector('splitter')

    splitter.onmousedown = ({altKey}) => {
      if (altKey) return this.rotate()

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
    ['topSection','leftSection','rightSection','bottomSection']
      .forEach(side => delete this[side])
    switch (this.props.direction) {
      case 'row':
        [this.leftSection,, this.rightSection] = this.el.children
        break;
      case 'column':
        [this.topSection,, this.bottomSection] = this.el.children
        break;
      case 'row-reverse':
        [this.rightSection,, this.leftSection] = this.el.children
        break;
      case 'column-reverse':
        [this.bottomSection,, this.topSection] = this.el.children
    }
  }
}

const splitViewDefaults = {
  direction: 'row',
  portion: 0.3,
  padding: 6,
  gap: 6,
  borderWidth: 1,
  borderColor: 'gray',
  borderRadius: 5,
}

const directions = ['row', 'column', 'row-reverse', 'column-reverse']

const svProps = {display: 'flex', width: '100%', height: '100%',
  boxSizing: 'border-box'}
const sectProps = {overflow: 'auto'}
const splitProps = {userSelect: 'none'}

function next(direction) {
  return directions[(directions.indexOf(direction) + 1) % 4]
}

function buildSplitView(direction) {
  const div = document.createElement('div')
  div.innerHTML = `
    <splitview>
      <section></section>
      <splitter></splitter>
      <section></section>
    </splitview>
  `
  return div.firstElementChild
}

function applyInlineStyling(el, props) {
  const [sect1, splitter, sect2] = el.children
  const { direction, padding, gap,
          borderWidth, borderColor, borderRadius } = props
  Object.assign(el.style, svProps, {flexDirection: direction})
  Object.assign(splitter.style, splitProps, direction.startsWith("row") ?
    {width: gap + 'px', height: null, cursor: 'col-resize'} :
      {width: null, height: gap + 'px', cursor: 'row-resize'})
  for (const sect of [sect1, sect2])
    Object.assign(sect.style, sectProps, {borderRadius: borderRadius + 'px',
      border: `${borderWidth}px solid ${borderColor}`})

  if (padding) el.style.padding = padding + 'px'
  else if (direction.startsWith("row")) {
    sect1.style.borderWidth =
      doBorder(direction.endsWith("reverse") ? 'left' : 'right', borderWidth)
    sect2.style.borderWidth =
      doBorder(direction.endsWith("reverse") ? 'right' : 'left', borderWidth)
  } else {
    sect1.style.borderWidth =
      doBorder(direction.endsWith("reverse") ? 'top' : 'bottom', borderWidth)
    sect2.style.borderWidth =
      doBorder(direction.endsWith("reverse") ? 'bottom' : 'top', borderWidth)
  }
}

function doBorder(side, width) {
  switch (side) {
    case 'top': return `${width}px 0 0 0`
    case 'left': return `0 0 0 ${width}px`
    case 'right': return `0 ${width}px 0 0`
    case 'bottom': return `0 0 ${width}px 0`
  }
}
