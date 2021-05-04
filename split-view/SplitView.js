export class SplitView {
  constructor (parent, options={}) {
    this.parent = parent
    this.props = {...splitViewDefaults, ...options}
    this.render()
    this.listen()
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
    let [sect1, _, sect2] = this.el.children
    const {direction, padding, gap} = this.props
    const sectionSpace = padding * -4 - gap +
      this.el['client' + (direction == "row" ? 'Width' : 'Height')]
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
  btnDelay: 2500,
}

const directions = ['row', 'column', 'row-reverse', 'column-reverse']

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
  el.style = `
    width:100%; height:100%; box-sizing: border-box; display:flex;
    flex-direction:${direction};
  `
  splitter.style = `
    display: flex; justify-content: center; align-items: center;
    ${direction.startsWith("row") ? `width: ${gap}px; cursor: col-resize`
      : `height: ${gap}px; cursor: row-resize`}; user-select: none;
  `
  sect1.style = sect2.style = `
    border: ${borderWidth}px solid ${borderColor};
    border-radius: ${borderRadius}px; overflow: auto;
  `
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
