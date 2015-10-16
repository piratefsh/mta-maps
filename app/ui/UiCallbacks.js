import dom from 'utils/DomUtils'
import ui from 'ui/UiControls'

export default {
    setResponsiveCallbacks(){
        // responsive toggle stuff
        const toggleLines = document.querySelector('#toggle-lines')
        const collapseElem = document.querySelector('.collapse-sm')
        dom.initToggle(toggleLines, {
            state: () => {
                return collapseElem.className.split(' ').indexOf('hidden-xs') > -1
            },
            on: {
                text: 'Hide Lines',
                callback: (e) => {
                    e.preventDefault()
                    collapseElem.className  = collapseElem.className.replace('hidden-xs', '')
                }
            },
            off: {
                text: 'Select Lines',
                callback: (e) => {
                    e.preventDefault()
                    collapseElem.className  += ' hidden-xs'
                }
            }
        })
    },

    // show/hide subway lines
    setSubwayLineControlBatch(selectAll, mapControls){
        const controls = document.querySelectorAll('.control-subway-line-batch')
        const batchClass = '.control-subway-line'
        const checkAllElem = document.querySelector(`input[value="check-all"]`)
        const checkNoneElem = document.querySelector(`input[value="check-none"]`)


        Array.prototype.forEach.call(controls, c => {
            c.onchange = e => {
                const val = e.target.value 
                
                let checkboxes = []
                let check = true

                if(val === 'check-all'){
                    checkboxes.push(...document.querySelectorAll(`${batchClass}:not(:checked)`))
                    checkNoneElem.checked = false
                    check = true
                }
                else if(val === 'check-none'){
                    checkboxes.push(...document.querySelectorAll(`${batchClass}:checked`))
                    checkboxes.push(checkAllElem)
                    check = false
                }

                if(checkboxes.length > 0){
                    checkboxes.forEach(cb => cb.checked = check)

                    // trigger map update
                    const event = new Event('change')
                    checkboxes[0].dispatchEvent(event)
                }
            }
        })

        // trigger initial check
        const triggerElem   = selectAll? checkAllElem : checkNoneElem
        const event         = new Event('change')
        triggerElem.checked = true 
        triggerElem.dispatchEvent(event)

        // hide station controls
        const hideLinesInput = document.querySelector('#show-lines-control')
        dom.initToggle(hideLinesInput, {
            state: () => hideLinesInput.checked,
            on: {
                text: 'Show Stations',
                callback: () => {
                    const lines = ui.getSelectedLines()
                    mapControls.toggleStations(true, lines)
                }
            },
            off: {
                text: 'Show Stations',
                callback: () => {
                    const lines = ui.getSelectedLines()
                    mapControls.toggleStations(false, lines)
                }
            }
        })
    },

    // create line checkboxes
    setSubwayLineControl(mapControls, icon, line){
        const fs = document.createElement('fieldset')
        const cb = document.createElement('input')
        cb.setAttribute('type', 'checkbox')
        cb.setAttribute('id', `subway-line-${line}`)
        cb.setAttribute('class', 'control-subway-line')
        cb.value    = `${line}`
        cb.onchange = () => {mapControls.showLines(ui.getSelectedLines())}

        const lbl       = document.createElement('label')
        lbl.innerHTML   = `${icon}`
        lbl.setAttribute('for', `subway-line-${line}`)
        fs.appendChild(cb)
        fs.appendChild(lbl)
        return fs
    }
}