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
            'markers': null,
            'station_names': null
        }

        this.markers = []
        this.stationNames = []

        this.setCallbacks()
        this.addAllStationMarkers()

        // center view in Manhattan
        const manhattanLatLng = [40.76702162667872, -73.98193359375]
        const zoomLevel = 12
        this.instance.setView(manhattanLatLng, zoomLevel)

        // when to show labels by default
        this.zoomThresholdForLabel = 12
    }

    setCallbacks(){
        this.instance.on('zoomend', () => {
            const layer = this.layers['station_names']
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
        // negate to get value for noHide
        this.layers.markers.eachLayer(l => {
            l.setLabelNoHide(val)
        })
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

            marker.bindLabel(title, {
                noHide: false,
                clickable: true,
                direction: 'auto',
                className: 'station-name'
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

            const station_name = `${s.station_name}`
            this.addCircleMarker(station_name, latlng, 
                s.color, popup)
        }
    }

    addAllStationMarkers() {
        const stations = StationData.stations 
        stations.forEach(s => this.addStationMarker(s))
        
        const markerLayer = this.L.featureGroup(this.markers)
        this.layers['markers'] = markerLayer
        markerLayer.addTo(this.instance)
    }

}

