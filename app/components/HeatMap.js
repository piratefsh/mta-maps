import SubwayMap from './SubwayMap'
import TurnstileData from 'files/turnstiles.json'
import heatCircleSvg from 'file!images/heat-circle.svg'
import heatCirclePng from 'images/heat-circle.png'

export default class HeatMap extends SubwayMap{
    constructor(...args){
        super(...args)
        this.data = TurnstileData
        this.heatLayerRefs = {}

        const max = this.data.max.entries > this.data.max.exits ? this.data.max.entries : this.data.max.exits 
        this.radiusRatio = 15/max
        this.minRadius = 2

        this.timeIntervals = [
            '00:00:00', 
            '04:00:00', 
            '08:00:00', 
            '12:00:00',
            '16:00:00',
            '20:00:00',
            '23:59:59']

        this.timeFrame = 2000
        this.dayFrame = this.timeFrame * (this.timeIntervals.length-1)
    }

    heat(options, onDoneInterval){
        const start = new Date(Date.parse(options.start))
        const end = new Date(Date.parse(options.end))
        const day = new Date(start)
        let timeout = 1000
        let timeFrame = this.dayFrame
        while(day <= end){
            const yr = `${day.getFullYear()}`
            let mo = `${day.getMonth() + 1}`
            let da = `${day.getDate()}`

            mo = mo.length == 1? `0${mo}` : mo
            da = da.length == 1? `0${da}` : da

            const formattedDate = `${yr}-${mo}-${da}`
            setTimeout(()=> {
                this.createHeatLayer(formattedDate, 'exits', onDoneInterval)
                this.createHeatLayer(formattedDate, 'entries', onDoneInterval)
            }, timeout)

            timeout += timeFrame
            // day = next day
            day.setDate(day.getDate() + 1)
        }
    }

    getRadius(volume){
        return this.radiusRatio * volume + this.minRadius
    }

    generateHeatSizes(date, which){
        const stations = this.data.stations

        // predefined time slots
        const heats = {}
        for(let time of this.timeIntervals){
            heats[time] = []
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
            const lines = this.stations[unit].line_name
            const stationName = this.stations[unit].station_name

            // check valid latlng
            if(!(ll && 'lat' in ll && 'lng' in ll)){
                continue
            }

            if(date in s['dates']){
                const times = s['dates'][date]['times']
                times.forEach(t => {
                    if(t.entries && t.exits){
                        const radius = this.getRadius(t[which])
                        const h = {
                            latlng: ll, 
                            radius: radius, 
                            unit: unit, 
                            entries: t.entries, 
                            exits: t.exits, 
                            lineName: lines,
                            stationName: stationName}

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

    // find index of lower/upper bound time interval, whichever is closest where 
    // list = ['00:00', '04:00', ... '20:00'] (sorted) 
    // and time = '03:55' returns 1, '01:00' returns 0
    // uses bisection/binary search
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
        
        // find if lower bound is closer, if there is one. 
        // have to add date so it's parsesable by Date lib
        if(lo > 0){
            let actual = new Date('2015-09-09 ' + time)
            let upper = new Date('2015-09-09 ' + list[lo])
            let lower = new Date('2015-09-09 ' + list[lo-1])
            // diff between this and lower
            if(actual - lower < upper - actual){
                return lo - 1
            }
        }

        return lo
    }

    // for each interval = for each day, for each time 
        // make feature layers 
    createHeatLayer(date, which, onDone){
        const sizes = this.generateHeatSizes(date, which)

        let frameLen = this.timeFrame
        let counter = frameLen

        for(let time in sizes){
            if(Object.keys(this.layers[which]).length < 1){
                this.createHeatLayerInit(sizes[time], which)
            }
            else{
                setTimeout(()=>{
                    this.updateHeatLayer(sizes[time], counter, frameLen)
                    const dt = new Date(Date.parse(`${date} ${time}`))
                    onDone(dt)
                }, counter)
                counter += frameLen
            }
        }
    }

    createHeatLayerInit(sizes, which){
        sizes.forEach(s => { this.initHeatLayer(s, which)} )
        
        this.eachHeatLayer(which, (ln, l) => {
            l.addTo(this)
        })
    }

    initHeatLayer(s, which){
        const h     = this.createHeatMarker(s.unit, s.latlng, s.radius, `${s.stationName}`, which)
        h.unit = s.unit
        this.heatLayerRefs[s.unit] = h

        const lines = s.lineName.split("")

        // add layer by lines 
        lines.forEach(l => {
            const layers = this.layers[which]
            if (l in layers){
                layers[l].addLayer(h)
            }
            else{
                layers[l] = this.L.featureGroup([h])
            }
        });
    }

    // for each layer in this. which = entries|exits
    eachHeatLayer(which, f){
        const lines = this.layers[which]
        for (let linename in lines){
            const layer = lines[linename]
            f(linename, layer)
        }
    }

    updateHeatLayer(sizes, offset, timeout){
        const delay = 10
        const frames = timeout/delay

        sizes.forEach(s => {
            if(s.unit in this.heatLayerRefs){
                const h     = this.heatLayerRefs[s.unit]
                const elemEnt = document.querySelector(`.heat-icon-entries-${s.unit}`)
                const elemExt = document.querySelector(`.heat-icon-exits-${s.unit}`)
                this.updateMarker(elemEnt, s, 'entries')
                this.updateMarker(elemExt, s, 'exits')
                
            }
            // if doesn't exist yet, create layer
            else{
                this.initHeatLayer(s, 'entries')
                this.initHeatLayer(s, 'exits')
            }
        })
    }

    updateMarker(elem, s, which){
        if(elem){
            const originalSizePx = elem.style.width
            const originalSize = parseInt(originalSizePx.slice(0, originalSizePx.length - 2))

            const radius = this.getRadius(s[which])
            const scale = radius/originalSize
            const rpx = Math.floor(radius) + 'px'
            const marginpx = -1 * Math.floor(radius/2) + 'px'
            
            elem.style.width = rpx
            elem.style.height = rpx
            elem.style.marginLeft = marginpx
            elem.style.marginTop = marginpx
        }
    }

    createHeatMarker(id, ll, radius, title, which){

        const whichClassName = which == 'entries' ? 'heat-icon-entries' : 'heat-icon-exits'
        radius = Math.floor(radius)
        const icon = new this.L.icon({
            iconUrl: heatCirclePng,
            iconRetinaUrl: heatCirclePng,
            iconSize: [0, 0],
            iconAnchor: [10, 10],
            popupAnchor: [10, 0],
            shadowSize: [0, 0],
            className: `heat-icon ${whichClassName}`,
        });

        icon.options.className += ` heat-icon-${which}-${id}`
        icon.options.iconSize = [radius, radius]
        icon.options.iconAnchor = [radius/2, radius/2]

        return this.L.marker(ll, {
            title: title,
            icon: icon
        })
    }
}