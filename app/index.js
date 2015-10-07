import test from './test'
import Map from './components/Map'
import SubwayLines from './components/SubwayLines'
import 'styles/style.scss' 


let map = new Map()
const sl = new SubwayLines()
let subwayLines = sl.getAllIcons()

let subwayListElem = document.querySelector('#subway-lines')
subwayListElem.innerHTML = subwayLines.map(s => `<li>${s}</li>`).join('')


