export default class MapControls{
    constructor(map){
        this.map = map 
        this.stationsVisible = true
        this.removeLayer = (linename, layer) => {
            this.map.removeLayer(layer)
        }
    }

    showLines(lines){
        this.showStations(lines)
        this.showHeats(lines)
    }

    showHeats(lines){
        const showL = (linename, layer) => {
            lines.forEach(l => {
                if(linename.indexOf(l) > -1){
                    layer.addTo(this.map).bringToFront()
                }
            })
        }

        this.map.eachHeatLayer('entries', this.removeLayer)
        this.map.eachHeatLayer('exits', this.removeLayer)
        this.map.eachHeatLayer('entries', showL)
        this.map.eachHeatLayer('exits', showL)
    }

    showStations(lines){
        if(this.stationsVisible) {
            this.map.eachLineLayer(this.removeLayer)
            this.map.eachLineLayer((linename, layer) => {
                lines.forEach(l => {
                    if(linename.indexOf(l) > -1){
                        layer.addTo(this.map).bringToFront()
                    }
                })
            })
        }
    }

    toggleStations(show, lines){
        this.stationsVisible = show
        if(show){
            this.showStations(lines)
        }
        else{
            this.map.eachLineLayer((name, layer) => this.map.removeLayer(layer))
        }
    }

}