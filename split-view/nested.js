import { SplitView } from './SplitView.js'

const options = {
  // direction: 'column',
  // direction: 'row-reverse',
  // direction: 'column-reverse',
  // padding: 0,
  // borderWidth: 2,
  // borderRadius: 20,
}
const splitView = new SplitView(document.body, options)

window.splitView = splitView

var {leftSection, rightSection} = splitView

options.direction = 'column'
options.padding = 8 * Math.round(Math.random())

const splitViewLeft = new SplitView(leftSection, options)
const splitViewRight = new SplitView(rightSection, options)

options.direction = 'row-reverse'

Object.assign(window, {splitView, splitViewLeft, splitViewRight})

const splitViewBottom = new SplitView(splitViewRight.bottomSection, options)


const backgrounds =
  ['AntiqueWhite', 'Aquamarine', 'DarkKhaki', 'DarkSalmon', 'GreenYellow']

const sections = [
  splitViewLeft.topSection, splitViewLeft.bottomSection,
  splitViewRight.topSection,
  splitViewBottom.leftSection, splitViewBottom.rightSection
]

sections.forEach((section, i) => section.style.background = backgrounds[i])
