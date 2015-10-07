import Mapbox from './Mapbox'
import StationData from '!json!files/stations.json'
import SubwayLines from './SubwayLines'

export default class Map{

    constructor() {
        // get leaflet L object
        this.L = Mapbox()
        this.subwayLines = new SubwayLines()

        // instantiate map
        this.instance = this.L.mapbox.map('map', 'piratefsh.nknilk08')
        
        // layers and markers
        this.layers = {
            'lines': {},
        }

        this.markers = []
        this.stationNames = []

        this.setCallbacks()
        this.addAllStationMarkers()

        // center view in East River
        const manhattanLatLng = [40.768033, -73.942108]
        const zoomLevel = 12
        this.instance.setView(manhattanLatLng, zoomLevel)

        // when to show labels by default
        this.zoomThresholdForLabel = 12
    }

    setCallbacks(){
        this.instance.on('zoomend', () => {
            if(this.instance.getZoom() > this.zoomThresholdForLabel){
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

    createStationMarker(s){
        if(s.coords && s.coords.lat && s.coords.lng){
            const latlng = [s.coords.lat, s.coords.lng]
            const lines = this.lineToIcons(s.line_name)

            const popupContent = `<div class='map-popup'><span class='title'>${s.station_name}</span>${lines}</div>`
            const popup = this.createPopUp(latlng, popupContent)

            const station_name = `${s.station_name}`
            const marker = this.createCircleMarker(station_name, latlng, 
                s.color, popup)
            marker.lineName = s.line_name
            return marker
        }
    }

    addAllStationMarkers() {
        const stations = StationData.stations 
        const markers = stations.map(s => this.createStationMarker(s))
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

        this.eachLineLayer((ln, l) => l.addTo(this.instance))

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

