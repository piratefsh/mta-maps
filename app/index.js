import test from './test'
import HeatMap from './components/HeatMap'
import MapControls from './components/MapControls'
import SubwayLines from './components/SubwayLines'
import ui from './ui/UiControls'
import cb from './ui/UiCallbacks'
import 'styles/style.scss' 

let map, mapControls

function init(){
    const startDate = '2015-09-28 GMT-04:00'
    const endDate = '2015-10-04 GMT-04:00'

    // must set size of map before initialization
    // because .fitBounds() does not like % or vh sizes
    ui.initMapSize()
    window.onresize = ui.initMapSize

    // init map and controls
    map = new HeatMap()
    mapControls = new MapControls(map)

    // init subway line controls
    const sl = new SubwayLines()
    const subwayLines = sl.getAllIcons()
    const subwayListElem = document.querySelector('#subway-lines')

    for(let lines in subwayLines){
        const icons = subwayLines[lines]
        const fs = cb.initSubwayLineControl(mapControls, icons,lines)
        subwayListElem.appendChild(fs)
    }

    cb.initSubwayLineControlBatch(true, mapControls)
    cb.setResponsiveCallbacks()
    ui.drawTimeline(startDate, endDate)
    ui.setDates(startDate, endDate)

    // init batch controls
    initStartAnimationBtnCallbacks(startDate, endDate)
}


function initStartAnimationBtnCallbacks(startDate, endDate){
    // callback on start button
    const startAnimationElem = document.querySelector('#start-animation')
    
    startAnimationElem.onclick = (e) => {
        if(e) e.preventDefault()
        const intervalPromises = map.heat({start: startDate, 
            end: endDate})

        for (let p of intervalPromises){
            p.then((datetime)=>{
                ui.updateHUDTime(datetime)
                ui.updateTimeline(datetime)
            })
        }
    }
    // dev
    // startAnimationElem.onclick()
}

init()
