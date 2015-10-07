import Map from './Map'

export default class MapControls{
    constructor(map){
        this.map = map 
    }

    showLine(l){
        const markers = this.map.layers['markers']
        console.log(markers)
        let counts = 0
        let countn = 0

        markers.eachLayer(marker => {
            const lines = marker.lineName
            //if is in line, show
            if (lines.indexOf(l) > -1){
                this.toggleMarkerShow(true, marker)
                counts++
            }
            else{
                this.toggleMarkerShow(false, marker)
                countn++
            }
        })

        console.log(counts, countn)
    }

    toggleMarkerShow(show, marker){
        if(show){
            marker.setStyle({
                opacity: 1,
                clickable: true,
            })
        }
        else{
            marker.setStyle({
                opacity: 0,
                clickable: false
            })
        }
    }
}