import { Dot } from './dot'
import { CheckBox } from './checkbox'
import { Draw } from './draw'

export class Data {
    constructor(width, height) {

        this.height = height
        this.width = width

        // restrict size of grid somehow, but also resize when too big 
        if (width > 20 || height > 20)
        {
            console.log('Grid size must be less than 20')
        }

        console.log(`Initialized dots-and-boxes with a ${width} x ${height} board.`)
       
        const draw = new Draw()
        // create array of dots
        this.Dots = []
        //draw global for the class       
        this.draw = draw

        for (let y = 0; y < height; y++) {
            const row = []
            this.Dots.push(row)
            for (let x = 0; x < width; x++) {
                let dot = new Dot(x, y)
                // push new Dots to array
                row.push(dot)
                // draw a dot here 
                draw.drawDots(dot.x_canvas, dot.y_canvas)
            }
        }

        //this.Dots[y][x]

        // create array of lines
        this.Lines = []

        // look out for two clicks, dot to dot 
        var clicks = 0
        this.clickedDots = []

        draw.canvas.addEventListener('click', (event) => {
            clicks++
            console.log(clicks)
            
            const rect = draw.canvas.getBoundingClientRect()

            if (clicks == 1) {
                // multiply by 2 because of pixel multiplier
                const x0 = (event.clientX - rect.left)*2
                const y0 = (event.clientY - rect.top)*2
                // figure out if a dot has been pressed and which one
                let dot = new Dot(x0, y0)
                let first_dot = dot.dotClick(this.Dots, width, height)
                if (first_dot != undefined) {
                    this.clickedDots.push(first_dot)
                }
                else {
                    clicks = 0
                }
            }
            else if (clicks == 2) {
                const x1 = (event.clientX - rect.left)*2
                const y1 = (event.clientY - rect.top)*2
                let dot = new Dot(x1, y1)
                let second_dot = dot.dotClick(this.Dots, width, height)
                if (second_dot != undefined && second_dot != this.clickedDots[0]) {
                    this.clickedDots.push(second_dot)
                    this.click()
                    clicks = 0
                }
                else if (second_dot != undefined && second_dot == this.clickedDots[0]) {
                    clicks = 1
                }
                else {
                    clicks = 0
                }
            }
        })

    }

    click() {

        let xmag = Math.abs(this.clickedDots[0].x - this.clickedDots[1].x)
        let ymag = Math.abs(this.clickedDots[0].y - this.clickedDots[1].y)

        if ((xmag == 1 && ymag == 0) || (xmag == 0 && ymag == 1)) {
            this.addLine(this.clickedDots[0].x, this.clickedDots[0].y, this.clickedDots[1].x, this.clickedDots[1].y) 
        } 
        
        this.clickedDots = []
    }

    addLine(x0, y0, x1, y1) {
        //called everytime a line is added by the player
        //takes input of two dots, line added to array

        //draw a line
        this.draw.drawLines(x0, y0, x1, y1)

        let currentLine = [x0,y0,x1,y1]
        let checker = new CheckBox(this.Lines, currentLine)
        this.checkBox(x0, y0, x1, y1, checker)
        this.Lines.push(currentLine)
    }

    checkBox(x0, y0, x1, y1, checkobj) {
        // uses the checkbox class to determine if a box has 
        // been formed out of all the possible lines that can be drawn
        if (this.Lines.length > 2) {
            // checks a line drawn horizontally at top edge
            if (y0 == 0 && y1 == 0) {
                if (checkobj.belowline()) {
                    this.draw.fillBox()
                }
            }
            // checks a line drawn horizontally at bottom edge
            else if (y0 == this.height-1 && y1 == this.height-1) {
                if (checkobj.aboveline()) {
                    this.draw.fillBox()
                }
            }
            // checks a line drawn vertically at left edge
            else if (x0 == 0 && x1 == 0) {
                if (checkobj.rightofline()) {
                    this.draw.fillBox()
                }
            }
            // checks a line drawn vertically at right edge
            else if (x0 == this.width-1 && x1 == this.width-1) {
                if (checkobj.leftofline()) {
                    this.draw.fillBox()
                }
            }
            // checks a line drawn horizontally anywhere between the edges of the grid 
            else if ((y0 == y1) && (y0 != 0 || y0 != this.height-1)) {
                if (checkobj.aboveline()) {
                    this.draw.fillBox()
                    if (checkobj.belowline()) {
                        this.draw.fillBox()
                    }
                }
                else if (checkobj.belowline()) {
                    this.draw.fillBox()
                }
            }
            // checks a line drawn vertically anywhere between the edges of the grid 
            else if ((x0 == x1) && (x0 != 0 || x0 != this.width-1)) {
                if (checkobj.leftofline()) {
                    this.draw.fillBox()
                    if (checkobj.rightofline()) {
                        this.draw.fillBox()
                    }
                }
                else if (checkobj.rightofline()) {
                    this.draw.fillBox()
                }
            }
        }
    }
}