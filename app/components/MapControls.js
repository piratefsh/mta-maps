export default class MapControls{
    constructor(map){
        this.map = map 
        this.instance = this.map.instance
    }

    showLines(lines){
        this.map.eachLineLayer((linename,layer) => {
            this.instance.removeLayer(layer)
        })

        this.map.eachLineLayer((linename,layer) => {
            lines.forEach(l => {
                if(linename.indexOf(l) > -1){
                    layer.addTo(this.instance)
                }
            })
        })
    }
}