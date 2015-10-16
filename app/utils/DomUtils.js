export default {
    initToggle(elem, options){
        /** Creates a toggle button
                options = {
                    state: () => 'function to test if toggle is on. 
                         returns true if is on, false if otherwise',      
                    on: {
                        text: 'innerHTML to show when toggle on'
                        callback: 'thing to do when toggle on'
                    },
                    off: {
                        text: 'innerHTML to show when toggle off'
                    callback: 'thing to do when toggle off'
                    }
                }
        **/
        elem.onclick = e => {
            //on
            if (options.state() == true) {
                options.on.callback(e)
                elem.innerHTML = options.on.text
            }
            //off
            else{
                options.off.callback(e)
                elem.innerHTML = options.off.text
            }
        } 
    }
}
