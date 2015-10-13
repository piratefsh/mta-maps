import SubwayMap from './SubwayMap'
import TurnstileData from 'files/turnstiles.json'
import TransitionedIcon from 'leaflet-transitionedicon'
import heatCircleSvg from 'file!images/heat-circle.svg'
import heatCirclePng from 'images/heat-circle.png'

export default class HeatMap extends SubwayMap{
    constructor(...args){
        super(...args)
        this.data = TurnstileData
        this.heatLayer = null
        this.heatLayerRefs = {}
        this.HeatIcon = TransitionedIcon.extend({
            options: {
                iconUrl: heatCirclePng,
                iconRetinaUrl: heatCirclePng,
                iconSize: [20, 20],
                iconAnchor: [10, 10],
                popupAnchor: [10, 0],
                shadowSize: [0, 0],
                className: 'heat-icon',
                cssTransitionJitterIn: 10,
                cssTransitionJitterOut: 0,
                cssTransitionName: 'heat-transition',
                cssTransitionBatches: 0
            }
        });

        this.radiusRatio = 10/this.data.max.entries 
        this.minRadius = 2

    }

    heat(options, onDoneInterval){
        const start = new Date(Date.parse(options.start))
        const end = new Date(Date.parse(options.end))
        const day = new Date(start)
        let timeout = 1000
        let timeFrame = 6000
        while(day <= end){
            const yr = `${day.getFullYear()}`
            let mo = `${day.getMonth() + 1}`
            let da = `${day.getDate()}`

            mo = mo.length == 1? `0${mo}` : mo
            da = da.length == 1? `0${da}` : da

            const formattedDate = `${yr}-${mo}-${da}`
            setTimeout(()=> {
                this.createHeatLayer(formattedDate, onDoneInterval)
            }, timeout)

            timeout += timeFrame
            // day = next day
            day.setDate(day.getDate() + 1)
        }
    }

    getRadius(volume){
        return this.radiusRatio * volume + this.minRadius
    }

    generateHeatSizes(date){
        const stations = this.data.stations

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
                        const radius = this.getRadius(t.entries)
                        const h = [ll, radius, unit, t.entries, unit]

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

        let frameLen = 1000
        let counter = frameLen

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
            const vol   = s[3]
            const id    = s[4]
            const h     = this.createHeatMarker(id, ll, r, vol)
            h.unit = unit
            heats.push(h)
            this.heatLayerRefs[unit] = h
            this.heatLayer = this.L.featureGroup(heats)
            this.heatLayer.addTo(this).bringToBack()
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
                const elem = document.querySelector(`.heat-icon-${unit}`)
                
                const originalSizePx = elem.style.width
                const originalSize = parseInt(originalSizePx.slice(0, originalSizePx.length - 2))

                const scale = r/originalSize
                const rpx = Math.floor(r) + 'px'
                const marginpx = -1 * Math.floor(r/2) + 'px'
                
                elem.style.width = rpx
                elem.style.height = rpx
                elem.style.marginLeft = marginpx
                elem.style.marginTop = marginpx
            }
        })
    }

    createHeatMarker(id, ll, radius, title){
        radius = Math.floor(radius)
        const icon = new this.HeatIcon()
        icon.options.className += ` heat-icon-${id}`
        icon.options.iconSize = [radius, radius]
        icon.options.iconAnchor = [radius/2, radius/2]

        return this.L.marker(ll, {
            title: title,
            icon: icon
        })
    }
}