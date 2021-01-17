export class CheckBox {
    constructor(lines, currentline) {
        this.lines = lines
        this.no_of_lines = lines.length

        this.x0 = currentline[0]
        this.y0 = currentline[1]
        this.x1 = currentline[2]
        this.y1 = currentline[3]
    }

    // iterate over the current list of lines drawn
    iterateOver(p_lines) {
        
        for (let i = 0; i < this.no_of_lines; i++) {
            let line = this.lines[i]
            var indx = p_lines.findIndex((element) => {
                if (JSON.stringify(element) == JSON.stringify(line)) { 
                return true
                }
            })
            
            if (indx != -1) {
                p_lines.splice(indx, 1)
            }
        }

        if (p_lines.length == 3) {
            return true
        }
        else {
            return false
        }
    }

    // check all lines to the left of current line
    leftofline() {
        // x0 == x1
        //line possibilities to left of a vertical line
        let line11 = [this.x0-1, this.y0, this.x0, this.y0]
        let line12 = [this.x0, this.y0, this.x0-1, this.y0]
        let line21 = [this.x0-1, this.y0, this.x1-1, this.y1]
        let line22 = [this.x1-1, this.y1, this.x0-1, this.y0]
        let line31 = [this.x1-1, this.y1, this.x1, this.y1]
        let line32 = [this.x1, this.y1, this.x1-1, this.y1]

        let poss_lines = [line11, line12, line21, line22, line31, line32]

        if (this.iterateOver(poss_lines)) {
            return true
        }
        else {
            return false
        }
    }

    // check all lines to the right of current line
    rightofline() {
        // x0 == x1
        //line possibilities to right of a vertical line
        let line11 = [this.x0+1, this.y0, this.x0, this.y0]
        let line12 = [this.x0, this.y0, this.x0+1, this.y0]
        let line21 = [this.x0+1, this.y0, this.x1+1, this.y1]
        let line22 = [this.x1+1, this.y1, this.x0+1, this.y0]
        let line31 = [this.x1+1, this.y1, this.x1, this.y1]
        let line32 = [this.x1, this.y1, this.x1+1, this.y1]

        let poss_lines = [line11, line12, line21, line22, line31, line32]

        if (this.iterateOver(poss_lines)) {
            return true
        }
        else {
            return false
        }
    }

    //check all lines above current line
    aboveline() {
        // y0 == y1
        //line possibilities above a horizontal line
        let line11 = [this.x0, this.y0, this.x0, this.y0-1]
        let line12 = [this.x0, this.y0-1, this.x0, this.y0]
        let line21 = [this.x0, this.y0-1, this.x1, this.y1-1]
        let line22 = [this.x1, this.y1-1, this.x0, this.y0-1]
        let line31 = [this.x1, this.y1-1, this.x1, this.y1]
        let line32 = [this.x1, this.y1, this.x1, this.y1-1]

        let poss_lines = [line11, line12, line21, line22, line31, line32]

        if (this.iterateOver(poss_lines)) {
            return true
        }
        else {
            return false
        }
    }

    //check all lines below current line
    belowline() {
        // y0 == y1
        //line possibilities below a horizontal line
        let line11 = [this.x0, this.y0, this.x0, this.y0+1]
        let line12 = [this.x0, this.y0+1, this.x0, this.y0]
        let line21 = [this.x0, this.y0+1, this.x1, this.y1+1]
        let line22 = [this.x1, this.y1+1, this.x0, this.y0+1]
        let line31 = [this.x1, this.y1+1, this.x1, this.y1]
        let line32 = [this.x1, this.y1, this.x1, this.y1+1]

        let poss_lines = [line11, line12, line21, line22, line31, line32]

        if (this.iterateOver(poss_lines)) {
            return true
        }
        else {
            return false
        }
    }
}