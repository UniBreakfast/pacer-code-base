export class SplitView {
  constructor (parent, options={}) {
    this.parent = parent
    this.options = {...splitViewDefaults, ...options}
    this.render()
  }

  render() {
    if (!this.el) this.el = buildSplitView(this.options.direction)
    this.parent.append(this.el)

    applyInlineStyling(this.el, this.options)


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

function buildSplitView(direction) {
  const div = document.createElement('div')
  div.innerHTML = `
    <splitview style="
      width:100%; height:100%; box-sizing: border-box; display:flex;
      flex-direction:${direction};
    ">
      <section></section>
      <splitter>
        <button>☰</button>
      </splitter>
      <section></section>
    </splitview>
  `
  return div.firstElementChild
}

function applyInlineStyling(el, props) {
  const [sect1, splitter, btn, sect2] = el.querySelectorAll('*')
  const { direction, portion, padding, gap,
    borderWidth, borderColor, borderRadius } = props

  splitter.style = `
    z-index: 1; display: flex;
    justify-content: center; align-items: center;
    ${direction == "row" ? `width: ${gap}px; cursor: col-resize`
      : `height: ${gap}px; cursor: row-resize`}
  `
  btn.style = `
    width: ${29+borderWidth}px; height: ${29+borderWidth}px;
    padding: 0 5px; font-size: 20px; line-height: 1; text-align: center;
    border: ${borderWidth}px solid ${borderColor}; border-radius: 50%;
  `
  sect1.style = sect2.style = `
    border: ${borderWidth}px solid ${borderColor};
    border-radius: ${borderRadius}px;
  `
  if (padding) el.style.padding = padding + 'px'
  else {
    sect1.style.borderWidth = direction == "row" ?
      `0 ${borderWidth}px 0 0` : `0 0 ${borderWidth}px 0`
    sect2.style.borderWidth = direction == "row" ?
      `0 0 0 ${borderWidth}px` : `${borderWidth}px 0 0 0`
  }
  const sectionSpace = padding * -4 - gap +
    el['client' + (direction == "row" ? 'Width' : 'Height')]
  sect1.style.flex = sectionSpace * portion
  sect2.style.flex = sectionSpace - sectionSpace * portion
}
