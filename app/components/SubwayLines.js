import LineColors from '!json!files/line_colors.json'

export default class SubwayLines{

    constructor(){
        this.colors = LineColors.colors
    }

    getIcon(singleLine){
        const l = singleLine
        const c = this.colors[l]
        return `<span class="line-icon" style='background-color:${c}'>${l}</span>`
    }

    getAllIcons(){
        const colors = Object.keys(this.colors)
        // const sortedColors = colors.sort((a,b) => {
        //     const ca = this.colors[a]
        //     const cb = this.colors[b]
        //     if(ca < cb) return -1
        //     else if(ca > cb) return 1
        //     else return 0
        // })
        const icons = colors.map(c => this.getIcon(c))
        return icons
    }


} 