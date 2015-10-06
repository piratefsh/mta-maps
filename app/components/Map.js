import Mapbox from './Mapbox'
import StationData from '!json!files/stations.json'

export default class Map{

    constructor() {
        // get leaflet L object
        this.L = Mapbox()

        // instantiate map
        this.instance = this.L.mapbox.map('map', 'piratefsh.nknilk08')

        this.addStations()
    }

    addMarker(label, coords) {
        if (coords && coords.lat && coords.lng){
            const marker = this.L.marker([coords.lat, coords.lng]).addTo(this.instance)
        }
    }

    addStations() {
        const stations = StationData.stations 
        stations.forEach(s => this.addMarker(s.unit, s.coords))
    }

}

