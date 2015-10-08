import SubwayMap from './SubwayMap'
import TurnstileData from 'files/turnstiles.json'

export default class HeatMap extends SubwayMap{
    constructor(...args){
        super(...args)
        this.data = TurnstileData
    }

    // for each interval = for each day, for each time 
        // make feature layers 
    createHeatLayer(date){
        const stations = this.data.stations
        const radiusRatio = 5/this.data.max.entries

        const heatsEnter = []
        const heatsExit = []

        for (let unit in stations){
            // check unit exists
            if(!(unit in this.stations)){
                console.log('warning, missing station ', unit, stations[unit].station_name)
                continue
            }

            const s = stations[unit]
            const ll = this.stations[unit].coords

            // check valid latlng
            if(!(ll && 'lat' in ll && 'lng' in ll)){
                continue
            }

            if(date in s['dates']){
                const times = s['dates'][date]['times']
                times.forEach(t => {
                    if(t.entries){
                        const radius = t.entries * radiusRatio
                        heatsEnter.push(this.L.circleMarker(ll, {
                            radius: radius,
                            color: 'white',
                            fillOpacity: 0.13
                        }))
                    }
                    if(t.exits){
                        const radius = t.entries * radiusRatio
                        heatsExit.push(this.L.circleMarker(ll, {
                            radius: radius,
                            color: 'blue',
                            fillOpacity: 0.13
                        }))
                    }
                })
            }
        }
        const hExit = this.L.featureGroup(heatsExit).addTo(this).bringToFront()
        const hEnt = this.L.featureGroup(heatsEnter).addTo(this).bringToFront()
        // this.layers['heats_enter'] 
    }
}