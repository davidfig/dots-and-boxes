import fps from 'yy-fps'

import { file } from './file/file'
// import { view } from './view'
import { input } from './input'
// import { state } from './state'
import { settings } from './settings'
import packageJSON from '../package.json'
import { Data } from './data/data'
import { Dot } from './data/dot'
import { CheckBox } from './data/checkbox'

const coverTime = 1500
// const maxFrameTime = 1000 / 60

class Main {
    async start() {
        const now = Date.now()
        if (settings.fps) {
            this.fps = new fps()
        }
        if (!settings.release) {
            const version = document.createElement('div')
            version.className = 'version'
            version.innerHTML = `v${packageJSON.version}`
            document.body.appendChild(version)
        }
        await file.init()
        // view.init()
        // state.init()
        input.init()
        this.last = Date.now()
        this.update()
        window.addEventListener('resize', () => this.resize())
        window.addEventListener('blur', () => this.pause())
        window.addEventListener('focus', () => this.resume())
        if (settings.cover) {
            this.handleCover(now)
        } else {
            document.querySelector('.cover').remove()
        }

        const data = new Data(5,5)
        data.addLine(0,0,0,1)
        data.addLine(0,0,1,0)
        data.addLine(0,1,1,1)
        data.addLine(1,1,1,0)
        console.log(data)
                
    }

    handleCover(now) {
        const remaining = coverTime - (Date.now() - now)
        if (remaining) {
            setTimeout(() => this.hideCover(), remaining)
        } else {
            this.hideCover()
        }
    }

    hideCover() {
        const cover = document.querySelector('.cover')
        cover.classList.add('cover-fade')
        setTimeout(() => cover.remove(), 1500)
    }

    pause() {
        this.paused = true
        if (this.raf) {
            cancelAnimationFrame(this.raf)
            this.raf = null
        }
    }

    resume() {
        this.paused = false
        this.last = Date.now()
        if (!this.raf) {
            this.update()
        }
    }

    resize() {
        // view.resize()
        // state.resize()
        // if (this.paused) {
        //     view.update()
        // }
    }

    update() {
        this.raf = null
        if (!this.paused) {
            // const now = Date.now()
            // let elapsed = now - this.last
            // elapsed = Math.min(elapsed, maxFrameTime)
            // this.last = now
            // state.update(elapsed)
            // view.update()
            if (this.fps) {
                this.fps.frame()
            }
            this.raf = requestAnimationFrame(() => this.update())
        }
    }
}

const main = new Main()

window.addEventListener('load', () => main.start())