export class Dot {
    constructor(x, y) {
        this.x = x
        this.y = y

        this.x_canvas = (x*50)+30
        this.y_canvas = (y*50)+35
    }

    dotClick(dots_matrix, n, m) {

        // use this.x and this.y to compare to the positions of each dot in dot matrix
        for (let _y = 0; _y < m; _y++) {
            for (let _x = 0; _x < n; _x++) {

                //console.log(dots_matrix[y][x].y_canvas)

                //takes the current x y of mouse click and figures out the distance from each dot
                let d = Math.sqrt((Math.pow(this.y-dots_matrix[_y][_x].y_canvas, 2) + Math.pow(this.x-dots_matrix[_y][_x].x_canvas, 2)))
                
                if (d < 8) {
                    //console.log(`This is dot ${dots_matrix[_y][_x].x}, ${dots_matrix[_y][_x].y}.`)
                    return dots_matrix[_y][_x]
                }
            }
        }
    }
}