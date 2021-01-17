import { Dot } from './dot'
import { CheckBox } from './checkbox'

export class Data {
    constructor(width, height) {
        console.log(`Initialized dots-and-boxes with a ${width} x ${height} board.`)
        // create array of dots
        this.Dots = []
        // create array of lines
        this.Lines = []

        this.height = height
        this.width = width

        for (let y = 0; y < height; y++) {
            const row = []
            this.Dots.push(row)
            for (let x = 0; x < width; x++) {
                // push new Dots to array
                row.push(new Dot(x, y))
            }
        }
    }

    addLine(x0, y0, x1, y1) {
        //called everytime a line is added by the player
        //takes input of two dots, line added to array
        let currentLine = [x0,y0,x1,y1]
        let checker = new CheckBox(this.Lines, currentLine)
        this.checkBox(x0, y0, x1, y1, checker)
        this.Lines.push(currentLine)
    }

    checkBox(x0, y0, x1, y1, checkobj) {
        // uses the checkbox class to determine if a box has 
        // been formed out of all the possible lines that can be drawn
        if (this.Lines.length != 0) {
            // checks a line drawn horizontally at top edge
            if (y0 == 0 && y1 == 0) {
                if (checkobj.belowline()) {
                    this.drawBox()
                }
            }
            // checks a line drawn horizontally at bottom edge
            else if (y0 == this.height-1 && y1 == this.height-1) {
                if (checkobj.aboveline()) {
                    this.drawBox()
                }
            }
            // checks a line drawn vertically at left edge
            else if (x0 == 0 && x1 == 0) {
                if (checkobj.rightofline()) {
                    this.drawBox()
                }
            }
            // checks a line drawn vertically at right edge
            else if (x0 == this.width-1 && x1 == this.width-1) {
                if (checkobj.leftofline()) {
                    this.drawBox()
                }
            }
            // checks a line drawn horizontally anywhere between the edges of the grid 
            else if ((y0 == y1) && (y0 != 0 || y0 != this.height-1)) {
                if (checkobj.aboveline() || checkobj.belowline()) {
                    this.drawBox()
                }
            }
            // checks a line drawn vertically anywhere between the edges of the grid 
            else if ((x0 == x1) && (x0 != 0 || x0 != this.width-1)) {
                if (checkobj.leftofline() || checkobj.rightofline()) {
                    this.drawBox()
                }
            }
        }
    }

    getDot(x ,y) {
        return this.Dots[y][x]
    }

    drawBox() {
        console.log('box formed')
    }
}