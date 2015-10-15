import test from './test'
import HeatMap from './components/HeatMap'
import MapControls from './components/MapControls'
import SubwayLines from './components/SubwayLines'
import 'styles/style.scss' 

let map, mapControls

function init(){
    initMapSize()

    window.onresize = initMapSize

    // init map and controls
    map = new HeatMap()
    mapControls = new MapControls(map)

    // init subway line controls
    const sl = new SubwayLines()
    const subwayLines = sl.getAllIcons()
    const subwayListElem = document.querySelector('#subway-lines')

    for(let lines in subwayLines){
        const icons = subwayLines[lines]
        const fs = createControlFieldset(icons,lines)
        subwayListElem.appendChild(fs)
    }

    // init batch controls
    initSubwayLineControlBatch(true)
    initBtnCallbacks()
}

function initMapSize(){
    // must set size of map before initialization
    // because .fitBounds() does not like % or vh sizes
    const mapElem = document.querySelector('#map')
    const mapContainerElem = document.querySelector('#map-container')
    const rect = mapContainerElem.getBoundingClientRect()

    mapElem.style.width = `${rect.width}px`
    mapElem.style.height = `${rect.height}px`
}

function initBtnCallbacks(){
    // callback on start button
    const startAnimationElem = document.querySelector('#start-animation')
    startAnimationElem.onclick = (e) => {
        if(e) e.preventDefault()
        map.heat({start: '2015-09-09 GMT-04:00', 
            end: '2015-09-15 GMT-04:00'}, updateHUDTime)
    }

    // responsive toggle stufff
    const toggleLines = document.querySelector('#toggle-lines')
    toggleLines.onclick = (e) => {
        e.preventDefault()
        const hideClass = 'hidden-xs'
        const collapseElem = document.querySelector('.collapse-sm')
        const classes = collapseElem.className
        const btn = e.target 

        if(classes.split(' ').indexOf(hideClass) > -1){
            collapseElem.className = classes.replace(hideClass, '')
            btn.innerHTML = 'Hide Lines'
        }
        else{
            collapseElem.className += ` ${hideClass}`
            btn.innerHTML = 'Select Lines'
        }
    }

    // dev
    // startAnimationElem.onclick()
}

function updateHUDTime(datetime){
    const datetimeDisplayElem = document.querySelector('.datetime-display')
    datetimeDisplayElem.innerHTML = datetime.toString()
}

function initSubwayLineControlBatch(selectAll){
    const controls = document.querySelectorAll('.control-subway-line-batch')
    const batchClass = '.control-subway-line'
    const checkAllElem = document.querySelector(`input[value="check-all"]`)
    const checkNoneElem = document.querySelector(`input[value="check-none"]`)


    Array.prototype.forEach.call(controls, c => {
        c.onchange = e => {
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

            if(checkboxes.length > 0){
                checkboxes.forEach(cb => cb.checked = check)

                // trigger map update
                const event = new Event('change')
                checkboxes[0].dispatchEvent(event)
            }
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
