import Mapbox from './Mapbox'
import StationData from '!json!files/stations.json'
import LineColors from '!json!files/line_colors.json'

export default class Map{

    constructor() {
        // get leaflet L object
        this.L = Mapbox()

        // instantiate map
        this.instance = this.L.mapbox.map('map', 'piratefsh.nknilk08')
        
        // layers and markers
        this.layers = {}
        this.markers = []

        this.addAllStationMarkers()
    }

    getMarkers(){
        return this.markers
    }

    createPopUp(latlng, content){
        const popup = L.popup()
            .setLatLng(latlng)
            .setContent(content)
        return popup
    }

    lineToIcons(linename){
        const lines = linename.split("")
        const colors = LineColors.colors
        const icons = lines.map(l => `<span class="line-icon" style='background-color:${colors[l]}'>${l}</span>`)
        return icons.join('')
    }

    addMarker(title, latlng, color, popup) {
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
            marker.bindPopup(popup)
            this.markers.push(marker)
        }
    }

    addStationMarker(s){
        if(s.coords && s.coords.lat && s.coords.lng){
            const latlng = [s.coords.lat, s.coords.lng]
            const lines = this.lineToIcons(s.line_name)
            const popupContent = `<div class='map-popup'><span class='title'>${s.station_name}</span>${lines}</div>`
            const popup = this.createPopUp(latlng, popupContent)
            this.addMarker(`${s.station_name}`, latlng, 
                s.color, popup)
        }
    }

    addAllStationMarkers() {
        const stations = StationData.stations 

        stations.forEach(s => this.addStationMarker(s))
        
        const markerLayer = this.L.layerGroup(this.getMarkers())
        this.layers['markers'] = markerLayer
        markerLayer.addTo(this.instance)
        // this.instance.fitBounds(markerLayer.getBounds())
    }

}

