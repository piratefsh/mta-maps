import SubwayMap from './SubwayMap'
import TurnstileData from 'files/turnstiles.json'
import HeatLayer from 'leaflet.heat'

export default class HeatMap extends SubwayMap{
    constructor(...args){
        super(...args)
        this.data = TurnstileData
    }

    // for each interval = for each day, for each time 
        // make feature layers 
    createHeatLayer(date, time){
        // for each station in interval
            // calculate radius
        // for each station 
            // add heat layers with radius

        const stations = Object.keys(this.data.stations)
        const radius_ratio = 30 / 10000


        for (let unit in stations){
            const s = stations[u]
            let radius = 0
            if(date in s && time in s[date]){
                const entries = s[date][time]['entry']
                radius = entries * radius_ratio
            }
        }
    }
}