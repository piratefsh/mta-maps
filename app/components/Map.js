import Mapbox from './Mapbox'
import stations from 'json!files/stations.json'

export default class Map{

    constructor() {
        // get leaflet L object
        this.L = Mapbox()

        // instantiate map
        this.L.mapbox.map('map', 'piratefsh.nknilk08')

        // this.addStations()
    }

    addMarker() {

    }

    addStations() {
        const stations = stations.stations 
        stations.forEach(s => console.log(s))
    }

}

