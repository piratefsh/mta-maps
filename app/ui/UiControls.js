export default {
    updateHUDTime(datetime){
        const datetimeDisplayElem       = document.querySelector('.datetime-display')
        datetimeDisplayElem.innerHTML   = datetime.toString()
    },

    updateTimeline(datetime){

        return
    },

    setDates(startDate, endDate){
        // show dates
        const datesContainer = document.querySelector('.dates')
        datesContainer.innerHTML = `Week of ${startDate.split(' ')[0]} to ${endDate.split(' ')[0]}.`
    },

    initMapSize(){
        // must set size of map before initialization
        // because .fitBounds() does not like % or vh sizes
        const mapElem = document.querySelector('#map')
        const mapContainerElem = document.querySelector('#map-container')
        const rect = mapContainerElem.getBoundingClientRect()

        mapElem.style.width = `${rect.width}px`
        mapElem.style.height = `${rect.height}px`
    },

    drawTimeline(startDate, endDate){
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

            // if weekend
            if(curr.getDay() == 0 || curr.getDay() == 6){
                d.className = 'weekend'
            }
            timelineElem.appendChild(d)
            curr.setDate(curr.getDate() + 1)
        }
    },

    // get lines checked
    getSelectedLines(){
        let checked = document.querySelectorAll('.control-subway-line:checked')
        const selectedStations = Array.prototype.map.call(checked, line => line.value)
        const indivStations = selectedStations.reduce((prev, elem) => {
            prev.push(...elem.split(""))
            return prev
        }, [])
        return indivStations
    }

}
