import SubwayMap from './SubwayMap'
import TurnstileData from 'files/turnstiles.json'

export default class HeatMap extends SubwayMap{
    constructor(...args){
        super(...args)
        this.data = TurnstileData
        this.heatLayer = null
        this.heatLayerRefs = {}
    }

    generateHeatSizes(date){
        const stations = this.data.stations
        const radiusRatio = 5/this.data.max.entries

        const heats = {}

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
                        const h = [ll, radius, unit] //this.createHeatMarker(ll, radius)
                        if (t.time in heats){
                            heats[t.time].push(h)
                        }
                        else{
                            heats[t.time] = [h]
                        }
                    }
                })
            }
        }
        return heats
    }

    // for each interval = for each day, for each time 
        // make feature layers 
    createHeatLayer(date, onDone){
        const sizes = this.generateHeatSizes(date)

        let counter = 0
        let frameLen = 500

        for(let time in sizes){
            if(this.heatLayer == null){
                this.createHeatLayerInit(sizes[time])
            }
            else{
                setTimeout(()=>{
                    this.updateHeatLayer(sizes[time], counter, frameLen)
                    const dt = new Date(Date.parse(`${date} ${time}`))
                    onDone(dt)
                }, counter)
                counter+=frameLen
            }
        }
    }

    createHeatLayerInit(sizes){
        const heats = []
        sizes.forEach(s => {
            const ll    = s[0]
            const r     = s[1]
            const unit  = s[2]
            const h     = this.createHeatMarker(ll, r)
            h.unit = unit
            heats.push(h)
            this.heatLayerRefs[unit] = h
            this.heatLayer = this.L.featureGroup(heats)
            this.heatLayer.addTo(this).bringToFront()
        })
    }

    updateHeatLayer(sizes, offset, timeout){
        const delay = 10
        const frames = timeout/delay

        sizes.forEach(s => {
            const ll    = s[0]
            const r     = s[1]
            const unit  = s[2]

            if(unit in this.heatLayerRefs){
                const h     = this.heatLayerRefs[unit]
                h.setRadius(r)
            }
        })
    }

    createHeatMarker(ll, radius){
        return this.L.circleMarker(ll, {
            radius: radius,
            color: 'white',
            fillOpacity: 0.13
        })
    }
}