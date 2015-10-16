export default {
    setDates(startDate, endDate){
        // set dates in description
        const datesContainer = document.querySelector('.dates')
        datesContainer.innerHTML = `Week of ${startDate.split(' ')[0]} to ${endDate.split(' ')[0]}.`
    },

    setMapSize(){
        // set map size to fill map-container
        const mapElem = document.querySelector('#map')
        const mapContainerElem = document.querySelector('#map-container')
        const rect = mapContainerElem.getBoundingClientRect()

        mapElem.style.width = `${rect.width}px`
        mapElem.style.height = `${rect.height}px`
    },
    
    updateHUDTime(datetime){
        // update time at corner of map. for use to update at every time interval
        const datetimeDisplayElem       = document.querySelector('.datetime-display')
        datetimeDisplayElem.innerHTML   = datetime.toString()
    },

    updateTimeline(datetime){
        let id = this.getIdFromDate(datetime)
        const elem = document.getElementById(id)

        return
    },

    drawTimeline(startDate, endDate){
        // draw timeline at bottom of map
        const days = "Sun Mon Tue Wed Thu Fri Sat".split(' ')
        const months = "Jan Feb Mar Apr May Jun Jul Aug Sept Oct Nov Dec".split(' ')
        const timelineElem = document.querySelector('.timeline')
        const start = new Date(Date.parse(startDate))
        const end = new Date(Date.parse(endDate))
        let curr = start
        while (curr <= end){
            let d = document.createElement('li')
            let f = `${days[curr.getDay()]}, ${months[curr.getMonth()]} ${curr.getDate()}`
            d.innerHTML = f
            d.id = this.getIdFromDate(curr.toString())

            // if weekend
            if(curr.getDay() == 0 || curr.getDay() == 6){
                d.className = 'weekend'
            }
            timelineElem.appendChild(d)
            curr.setDate(curr.getDate() + 1)
        }
    },

    getIdFromDate(dateString){
        // given date format 'Thu Oct 01 2015 20:00:00 GMT-0400 (EDT)'
        // return id in format 'Thu-Oct-01-2015'
        const id = `${dateString}`.split(' ').slice(0, 4).join('-')
        return id
    },

    getSelectedLines(){
        // get lines checked in sidebar as array e.g. ['A', 'G' ... 'S']
        let checked = document.querySelectorAll('.control-subway-line:checked')
        const selectedStations = Array.prototype.map.call(checked, line => line.value)
        const indivStations = selectedStations.reduce((prev, elem) => {
            prev.push(...elem.split(""))
            return prev
        }, [])
        return indivStations
    }

}
