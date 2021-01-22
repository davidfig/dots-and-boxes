export class Draw {
    constructor() {

        // multipler to give actual grid heights and widths 
        // this.gridwidth = (gridwidth+1) * 40
        // this.gridheight = (gridheight+1) * 40

        // initiate canvas
        const canvas = document.querySelector('.view')
        //console.log(canvas)
        const ctx = canvas.getContext('2d')

        var dpr = window.devicePixelRatio //2
        var rect = canvas.getBoundingClientRect()

        this.canvas = canvas
        this.ctx = ctx

        this.canvas.width = rect.width*dpr //device pixel ratio gives resolution multiplier
        this.canvas.height = rect.height*dpr

        this.ctx.scale(dpr,dpr)

    }

    drawDots(x_position, y_position) {
        
        let dot_size = 6
        this.ctx.strokeStyle = 'black'
        this.ctx.beginPath()
        this.ctx.arc((x_position*50)+27, (y_position*50)+30, dot_size, 0, Math.PI*2, true)
        this.ctx.stroke()
        this.ctx.fill()
    }

    drawLines(x0_position, y0_position, x1_position, y1_position) {

        this.ctx.strokeStyle = 'coral'
        this.ctx.beginPath()
        this.ctx.lineWidth = 3
        this.ctx.moveTo((x0_position*50)+27,(y0_position*50)+30)
        this.ctx.lineTo((x1_position*50)+27, (y1_position*50)+30)
        this.ctx.stroke()
    }

    fillBox() {
        // player initial in centre of box formed
        console.log('box formed')


    }

}