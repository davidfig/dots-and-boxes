export class Draw {
    constructor() {

        // multipler to give actual grid heights and widths 
        // this.gridwidth = (gridwidth+1) * 40
        // this.gridheight = (gridheight+1) * 40

        // initiate canvas
        const canvas = document.querySelector('.view')
        const ctx = canvas.getContext('2d')

        this.canvas = canvas
        this.ctx = ctx

        this.canvas.width = window.innerWidth * 2  //device pixel ratio gives resolution multiplier
        this.canvas.height = window.innerHeight * 2

        // centre values
        this.centreX = this.canvas.width / 2
        this.centreY = this.canvas.height / 2

        // // create box for game implementation in centre of screen
        // this.ctx.lineWidth = 3
        // this.ctx.strokeStyle = 'coral'
        // this.ctx.strokeRect(this.centreX-(this.gridwidth/2), this.centreY-(this.gridheight/2), this.gridwidth, this.gridheight)
        
        let fontsize = 40

        // text
        this.ctx.font = `${fontsize}px Calibri`
        this.ctx.fillStyle = 'black'
        this.ctx.fillText('Dots and Boxes - OL', 20, 40)

    }

    drawDots(x_position, y_position) {
        
        let dot_size = 8

        this.ctx.strokeStyle = 'black'
        this.ctx.beginPath()
        this.ctx.arc(x_position, y_position, dot_size, 0, Math.PI*2, true)
        this.ctx.stroke()
        this.ctx.fill()
    }

    drawLines(x0_position, y0_position, x1_position, y1_position) {

        this.ctx.strokeStyle = 'coral'
        this.ctx.beginPath()
        this.ctx.lineWidth = 3
        this.ctx.moveTo((x0_position*70)+50,(y0_position*70)+80)
        this.ctx.lineTo((x1_position*70)+50, (y1_position*70)+80)
        this.ctx.stroke()
    }

    fillBox() {
        // player initial in centre of box formed
        console.log('box formed')
    }

}