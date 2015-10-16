import test from './test'
import HeatMap from './components/HeatMap'
import MapControls from './components/MapControls'
import SubwayLines from './components/SubwayLines'
import ui from './ui/UiControls'
import cb from './ui/UiCallbacks'
import 'styles/style.scss' 

let map, mapControls

function init(){
    const startDate = '2015-09-28 00:00:00 GMT-04:00'
    const endDate = '2015-09-29 23:59:59 GMT-04:00'
    // const endDate = '2015-10-04 23:59:59 GMT-04:00'

    // must set size of map before initialization because .fitBounds() 
    // does not like % or vh sizes
    ui.setMapSize()
    window.onresize = ui.setMapSize

    // init map and controls
    map = new HeatMap()
    mapControls = new MapControls(map)

    const sl = new SubwayLines()
    const subwayLines = sl.getAllIcons()
    const subwayListElem = document.querySelector('#subway-lines')

    // init subway line controls
    for(let lines in subwayLines){
        // for each station
        const icons = subwayLines[lines]
        const fs = cb.setSubwayLineControl(mapControls, icons,lines)
        subwayListElem.appendChild(fs)
    }

    // for 'select all/none controls'
    cb.setSubwayLineControlBatch(true, mapControls)

    // for 'hide/show lines when in mobile mode'
    cb.setResponsiveCallbacks()

    // create timeline at bottom of map
    ui.drawTimeline(startDate, endDate)
    ui.setDates(startDate, endDate)

    initStartAnimationBtnCallbacks(startDate, endDate)
}

function initStartAnimationBtnCallbacks(startDate, endDate){
    // this button makes the magic happen
    const startAnimationElem = document.querySelector('#start-animation')

    startAnimationElem.onclick = (e) => {
        if(e) e.preventDefault()

        // disable button until animation done
        startAnimationElem.disabled = true

        // start heating the map up, y'all
        let intervalPromises = map.heat({start: startDate, 
            end: endDate})

        intervalPromises = intervalPromises.map(p => {
            p.then(datetime => {
                ui.updateHUDTime(datetime)
                ui.updateTimeline(datetime)
                console.log(Date.parse(datetime),Date.parse(endDate))
                if( Date.parse(datetime) >= Date.parse(endDate) ){
                    startAnimationElem.disabled = false
                }
            })
        })

        Promise.all(intervalPromises).catch( e => {
            console.error('Something went wrong!', e)
        })
    }

    // For development purposes
    startAnimationElem.onclick()
}

init()
