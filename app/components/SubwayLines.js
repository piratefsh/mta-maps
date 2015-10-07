import LineColors from '!json!files/line_colors.json'
import LineColorsGrouped from '!json!files/line_colors_grouped.json'

export default class SubwayLines{

    constructor(){
        this.colors = LineColors.colors
        this.lines = LineColorsGrouped.colors
    }

    format(c, l){
        return `<span class="line-icon" style='background-color:${c}'>${l}</span>`
    }
    
    getIcon(singleLine){
        const l = singleLine
        const c = this.colors[l]
        return this.format(c, l)
    }

    getAllIcons(){
        const lines = []
        const sortedKeys = Object.keys(this.lines).sort()
        for (let key of sortedKeys){
            const indivLines = key.split("")
            const c = this.lines[key]
            const icons = indivLines.map(l => this.format(c, l))
            const line = `<div>${icons.join('')}</div>`
            lines[key] = line
        }
        return lines
    }


} 