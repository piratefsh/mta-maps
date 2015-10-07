import test from './test'
import Map from './components/Map'
import MapControls from './components/MapControls'
import SubwayLines from './components/SubwayLines'
import 'styles/style.scss' 

// init map
let map = new Map()
let mapControls = new MapControls(map)
// init subway line controls
const sl = new SubwayLines()
let subwayLines = sl.getAllIcons()
let subwayListElem = document.querySelector('#subway-lines')
const controls = subwayLines.map((s,i) => {
    const fs = document.createElement('fieldset')
    const cb = document.createElement('input')
    cb.setAttribute('type', 'checkbox')
    cb.setAttribute('id', `subway-line-${i}`)
    cb.setAttribute('class', 'control-subway-line')

    const lbl = document.createElement('label')
    lbl.innerHTML = `${s}`
    lbl.setAttribute('for', `subway-line-${i}`)
    fs.appendChild(cb)
    fs.appendChild(lbl)

    subwayListElem.appendChild(fs)
})

// const controls = document.querySelector('#subway-lines .control-subway-line')
// mapControls.showLines(['A', 'G'])