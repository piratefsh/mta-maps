export default class MapControls{
    constructor(map){
        this.map = map 
    }

    showLines(lines){
        const r = (linename,layer) => {
            this.map.removeLayer(layer)
        }

        this.map.eachLineLayer(r)
        this.map.eachHeatLayer('entries', r)
        this.map.eachHeatLayer('exits', r)

        const f = (linename,layer) => {
            lines.forEach(l => {
                if(linename.indexOf(l) > -1){
                    layer.addTo(this.map).bringToFront()
                }
            })
        }

        this.map.eachLineLayer(f)
        this.map.eachHeatLayer('entries', f)
        this.map.eachHeatLayer('exits', f)
    }
}