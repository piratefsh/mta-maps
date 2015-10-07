import 'mapbox.js' 
import 'mapbox.js/theme/style.css'
import 'leaflet.label'
import 'leaflet.label/dist/leaflet.label.css'

export default function Mapbox(){
    L.mapbox.accessToken = 'pk.eyJ1IjoicGlyYXRlZnNoIiwiYSI6IjlNT2dMUGcifQ.cj4j9z29wjkXPAi7nK7ArA';
    return L
}

