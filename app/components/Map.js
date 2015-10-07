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
        this.layers = {
            'markers': null,
            'station_names': null
        }

        this.markers = []
        this.stationNames = []

        this.setCallbacks()
        this.addAllStationMarkers()

        this.instance.setView([40.76702162667872, -73.98193359375], 12)

        // this.instance.setZoom(13)
    }

    setCallbacks(){
        this.instance.on('zoomend', () => {
            const layer = this.layers['station_names']
            if(this.instance.getZoom() > 12){
                layer.addTo(this.instance).bringToBack()
            }
            else{
                this.instance.removeLayer(layer)
                
            }
        })
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

    addCircleMarker(title, latlng, color, popup) {
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

    addTextMarker(title, latlng, popup) {
        const icon = this.L.divIcon({
            className: 'station-name',
            html: `${title}` 
        })
        const marker = this.L.marker(latlng, {
            icon: icon
        })
        marker.bindPopup(popup)
        this.stationNames.push(marker)
    }

    addStationMarker(s){
        if(s.coords && s.coords.lat && s.coords.lng){
            const latlng = [s.coords.lat, s.coords.lng]
            const lines = this.lineToIcons(s.line_name)

            const popupContent = `<div class='map-popup'><span class='title'>${s.station_name}</span>${lines}</div>`
            const popup = this.createPopUp(latlng, popupContent)

            const station_name = `${s.station_name}`
            this.addCircleMarker(station_name, latlng, 
                s.color, popup)

            this.addTextMarker(station_name, latlng, popup)
        }
    }

    addAllStationMarkers() {
        const stations = StationData.stations 
        stations.forEach(s => this.addStationMarker(s))
        
        const markerLayer = this.L.featureGroup(this.markers)
        const stationNameLayer = this.L.featureGroup(this.stationNames)

        this.layers['markers'] = markerLayer
        this.layers['station_names'] = stationNameLayer

        markerLayer.addTo(this.instance)
        // stationNameLayer.addTo(this.instance)
        let bounds = markerLayer.getBounds()
    }

}

