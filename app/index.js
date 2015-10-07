import test from './test'
import SubwayMap from './components/SubwayMap'
import HeatMap from './components/HeatMap'
import MapControls from './components/MapControls'
import SubwayLines from './components/SubwayLines'
import 'styles/style.scss' 

let map, mapControls

function init(){
    // init map and controls
    map = new SubwayMap()
    mapControls = new MapControls(map)

    // init subway line controls
    const sl = new SubwayLines()
    let subwayLines = sl.getAllIcons()
    let subwayListElem = document.querySelector('#subway-lines')

    for(let lines in subwayLines){
        const icons = subwayLines[lines]
        const fs = createControlFieldset(icons,lines)
        subwayListElem.appendChild(fs)
    }

    // init batch controls
    initSubwayLineControlBatch(true)
}

function initSubwayLineControlBatch(selectAll){
    const controls = document.querySelectorAll('.control-subway-line-batch')
    const batchClass = '.control-subway-line'
    const checkAllElem = document.querySelector(`input[value="check-all"]`)
    const checkNoneElem = document.querySelector(`input[value="check-none"]`)


    Array.prototype.forEach.call(controls, c => {
        c.onchange = (e) => {
            const val = e.target.value 
            
            let checkboxes = []
            let check = true

            if(val === 'check-all'){
                checkboxes.push(...document.querySelectorAll(`${batchClass}:not(:checked)`))
                checkNoneElem.checked = false
                check = true
            }
            else if(val === 'check-none'){
                checkboxes.push(...document.querySelectorAll(`${batchClass}:checked`))
                checkboxes.push(checkAllElem)
                check = false
            }
            checkboxes.forEach(cb => cb.checked = check)

            // trigger map update
            checkboxes[0].onchange()
        }
    })

    // trigger initial check
    const triggerElem = selectAll? checkAllElem : checkNoneElem
    const event = new Event('change')
    triggerElem.checked = true 
    triggerElem.dispatchEvent(event)
}

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
    cb.onchange = onSubwayLineControlClick

    const lbl = document.createElement('label')
    lbl.innerHTML = `${icon}`
    lbl.setAttribute('for', `subway-line-${line}`)
    fs.appendChild(cb)
    fs.appendChild(lbl)
    return fs
}

init()