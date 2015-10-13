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

        // predefined time slots
        const heats = {
            '00:00:00': [],
            '04:00:00': [],
            '08:00:00': [],
            '12:00:00': [],
            '16:00:00': [],
            '20:00:00': [],
            '23:59:59': []
        }

        const intervals = Object.keys(heats).sort()

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
                        const h = [ll, radius, unit]

                        // find time interval it belongs to
                        const i = this.findTimeInterval(intervals, t.time)
                        if (i > -1){
                            heats[intervals[i]].push(h)
                        }
                    }
                })
            }
        }
        return heats
    }

    // find index of upper bound time interval where 
    // list = ['00:00', '04:00', ... '20:00'] (sorted) 
    // and time = '03:55' returns 1. uses bisection/binary search
    findTimeInterval(list, time){
        if(list.length < 1 || time.length < 1){
            return -1
        }
        let lo = 0;
        let hi = list.length
        let mid;
        while(lo < hi){
            mid = Math.floor((lo + hi)/2)
            if (list[mid] < time){
                lo = mid + 1
            }
            else{
                hi = mid
            }
        }
        return lo
    }

    // for each interval = for each day, for each time 
        // make feature layers 
    createHeatLayer(date, onDone){
        const sizes = this.generateHeatSizes(date)

        let counter = 0
        let frameLen = 1000

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