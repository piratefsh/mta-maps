import Map from './Map'

export default class MapControls{
    constructor(map){
        this.map = map 
        this.instance = this.map.instance
    }

    showLine(l){
        this.map.eachLineLayer((linename,layer) => {
            this.instance.removeLayer(layer)
        })

        this.map.eachLineLayer((linename,layer) => {
            if(linename.indexOf(l) > -1){
                layer.addTo(this.instance)
            }
        })
    }
}