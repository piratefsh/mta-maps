import Mapbox from './Mapbox'
import LMap from 'mapbox.js/src/map.js'
import StationData from '!json!files/stations.json'
import SubwayLines from './SubwayLines'

const L = Mapbox()

export default class SubwayMap extends LMap.Map{

    constructor() {
        super('map', 'piratefsh.nknilk08')
        // get leaflet L object
        this.L = Mapbox()
        this.subwayLines = new SubwayLines()
        this.stations = StationData.stations
        // layers and markers
        this.layers = {
            'lines': {},
            'entries': {},
            'exits': {}
        }

        this.markers = []
        this.stationNames = []

        this.setCallbacks()
        this.addAllStationMarkers()

        // center view in East River
        const manhattanLatLng = [40.768033, -73.942108]
        const zoomLevel = 12
        this.setView(manhattanLatLng, zoomLevel)

        // when to show labels by default
        this.zoomThresholdForLabel = 13
    }

    setCallbacks(){
        this.on('zoomend', () => {
            if(this.getZoom() > this.zoomThresholdForLabel){
                // make all labels noHide = true
                // i.e. always show labe;
                this.showMarkerLabel(true)
            }
            else{
                this.showMarkerLabel(false)
                
            }
        })
    }

    showMarkerLabel(val){
        this.eachLineLayer((linename, l) => {
            l.eachLayer(m => m.setLabelNoHide(val))
        })
    }

    // for each layer in this
    eachLineLayer(f){
        const lines = this.layers['lines']
        for (let linename in lines){
            const layer = lines[linename]
            f(linename, layer)
        }
    }

    createPopUp(latlng, content){
        const popup = L.popup()
            .setLatLng(latlng)
            .setContent(content)
        return popup
    }

    lineToIcons(linename){
        const lines = linename.split("")
        const icons = lines.map(l => this.subwayLines.getIcon(l))
        return icons.join('')
    }

    createCircleMarker(title, latlng, color, popup) {
        if (latlng){
            const marker = this.L.circleMarker(latlng,
                {
                    title: title,
                    riseOnHover: true,
                    radius: 5,
                    stroke: false,
                    color: color,
                    fillOpacity: 0.6,
                })

            marker.bindLabel(title, {
                noHide: false,
                clickable: true,
                direction: 'auto',
                className: 'station-name'
            })

            marker.bindPopup(popup)
            return marker
            
        }
    }

    createStationMarker(unit, s){
        if(s.coords && s.coords.lat && s.coords.lng){
            const latlng = [s.coords.lat, s.coords.lng]
            const lines = this.lineToIcons(s.line_name)

            const popupContent = `<div class='map-popup'><span class='title'>${s.station_name} <small class='unit'>${unit}</small></span>${lines}</div>`
            const popup = this.createPopUp(latlng, popupContent)

            const station_name = `${s.station_name}`
            const marker = this.createCircleMarker(station_name, latlng, 
                s.color, popup)
            marker.lineName = s.line_name
            marker.unit = unit
            return marker
        }
    }

    addAllStationMarkers() {
        const stations = this.stations 

        // const markers = stations.map(s => this.createStationMarker(s))
        const markers = []
        for (let unit in stations){
            const data = stations[unit]
            const m = this.createStationMarker(unit, data)
            markers.push(m)
        }
        
        // for each marker, add to layer for their line
        markers.forEach(m => {
            if (m == null) return 

            const lines = m.lineName.split("")
            lines.forEach(l => {
                if (l in this.layers['lines']){
                    this.layers['lines'][l].addLayer(m)
                }
                else{
                    this.layers['lines'][l] = this.L.featureGroup([m])
                }
            })
        })

        this.eachLineLayer((ln, l) => l.addTo(this))

    }

    // debug tools
    _printLines(){
        this.eachLineLayer((ln, l) => {
            const station = []
            l.eachLayer(m => station.push(m.options.title))
            console.log(ln, station)
        })
    }

}

