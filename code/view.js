import * as PIXI from 'pixi.js'

const width = 200
const height = 100
const bottom = 10
class View {
    init() {
        // PIXI.Ticker.shared.autoStart = false
        // PIXI.Ticker.shared.stop()
        this.renderer = new PIXI.Renderer({
            view: document.querySelector('.view'),
            resolution: window.devicePixelRatio,
            transparent: false,
            clearBeforeRender: false,
        })
        // this.renderer.plugins.interaction.destroy()
        this.screen = new PIXI.Container()
        this.stage = this.screen.addChild(new PIXI.Container())
        this.blocks = this.screen.addChild(new PIXI.Graphics())
        this.states = this.stage.addChild(new PIXI.Container())
        this.resize()
    }

    get bottom() {
        return this.height - bottom
    }

    resize() {
        this.renderer.resize(window.innerWidth, window.innerHeight)
        this.zoom = window.innerWidth / width
        this.blocks.clear()
        if (window.innerHeight / this.zoom  >= height) {
            this.width = width
            this.height = Math.min(height, window.innerHeight / this.zoom)
            this.stage.x = 0
            this.stage.y = ((window.innerHeight / this.zoom) / 2 - this.height / 2) * this.zoom
            const y = this.stage.y + height * this.zoom
            this.blocks.beginFill(0)
                .drawRect(0, 0, window.innerWidth, this.stage.y - 1)
                .beginFill(0)
                .drawRect(0, y, window.innerWidth, window.innerHeight - y)
                .endFill()
        } else {
            this.zoom = window.innerHeight / height
            this.width = Math.min(width, window.innerWidth / this.zoom)
            this.stage.x = ((window.innerWidth / this.zoom) / 2 - this.width / 2) * this.zoom
            this.stage.y = 0
            this.height = height
        }
        this.stage.scale.set(this.zoom)
    }

    update() {
        this.renderer.render(this.screen)
    }
}

export const view = new View()