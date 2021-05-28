import {SplitView} from './presentation-layer/components/SplitView.js'

const options = JSON.parse(localStorage.pacerDevLayers_bodySplitOptions || 0)
  || {
    direction: 'column-reverse',
    portion: 0.8,
    padding: 0,
    gap: 3,
    borderWidth: 1,
    borderRadius: 0,
  }

export const splitBody = new SplitView(document.body, options)


splitBody.addEventListener('change', () => {
  localStorage.pacerDevLayers_bodySplitOptions = JSON.stringify(splitBody.props)
})
