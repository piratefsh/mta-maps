export default class MapControls{
    constructor(map){
        this.map = map 
    }

    showLines(lines){
        this.map.eachLineLayer((linename,layer) => {
            this.map.removeLayer(layer)
        })

        this.map.eachLineLayer((linename,layer) => {
            lines.forEach(l => {
                if(linename.indexOf(l) > -1){
                    layer.addTo(this.map).bringToFront()
                }
            })
        })
    }
}