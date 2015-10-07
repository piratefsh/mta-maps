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

for(let lines in subwayLines){
    const icons = subwayLines[lines]
    const fs = createControlFieldset(icons,lines)
    subwayListElem.appendChild(fs)
}

// const controls = document.querySelector('#subway-lines .control-subway-line')
// mapControls.showLines(['A', 'G'])

function onSubwayLineControlClick(e){
    // get all checked
    let checked = document.querySelectorAll('.control-subway-line:checked')
    const selectedStations = Array.prototype.map.call(checked, line => line.value)
    const indivStations = selectedStations.reduce((prev, elem) => {
        prev.push(...elem.split(""))
        return prev
    }, [])
    mapControls.showLines(indivStations)
}

function createControlFieldset(icon, line){
    const fs = document.createElement('fieldset')
    const cb = document.createElement('input')
    cb.setAttribute('type', 'checkbox')
    cb.setAttribute('id', `subway-line-${line}`)
    cb.setAttribute('class', 'control-subway-line')
    cb.value = `${line}`
    cb.onclick = onSubwayLineControlClick

    const lbl = document.createElement('label')
    lbl.innerHTML = `${icon}`
    lbl.setAttribute('for', `subway-line-${line}`)
    fs.appendChild(cb)
    fs.appendChild(lbl)
    return fs
}