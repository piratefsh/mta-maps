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
    subwayListElem.innerHTML = subwayLines
        .map((s,i) => `<fieldset>\
            <input type='checkbox' id='subway-line-${i}' class='control-subway-line'/>\
            <label for='subway-line-${i}' >${s}</label></fieldset>`).join('')

const controls = document.querySelector('#subway-lines .control-subway-line')

mapControls.showLine('G')