import { view } from './view'
import { settings } from './settings'
import { level } from './level/level'

const alpha = 0.05

class State {
    init() {
        this.states = {
            level,
        }
        for (const key in this.states) {
            this.states[key].init()
        }
        this.state = settings.state || 'level'
    }

    set state(state) {
        if (state !== this._state) {
            if (this._state) {
                this.old = this.states[this._state]
            }
            this._state = state
            const current = this.states[this._state]
            if (this.old) {
                const index = view.states.children.indexOf(this.old)
                view.states.addChildAt(current, index === 0 ? 0 : index)
                if (typeof this.old.hide !== 'undefined') {
                    this.old.hide()
                }
            } else {
                view.states.addChild(current)
            }
            current.change()
        }
    }
    get state() {
        return this._state
    }

    resize() {
        for (const key in this.states) {
            this.states[key].resize()
        }
    }

    down(point) {
        if (typeof this.states[this.state].down !== 'undefined') {
            this.states[this.state].down(point)
        }
    }

    move(point) {
        if (typeof this.states[this.state].move !== 'undefined') {
            this.states[this.state].move(point)
        }
    }

    up(point) {
        if (typeof this.states[this.state].up !== 'undefined') {
            this.states[this.state].up(point)
        }
    }

    keyDown(e) {
        if (typeof this.states[this.state].keyDown !== 'undefined') {
            this.states[this.state].keyDown(e)
        }
    }

    keyUp(e) {
        if (typeof this.states[this.state].keyUp !== 'undefined') {
            this.states[this.state].keyUp(e)
        }
    }

    update(elapsed) {
        const current = this.states[this._state]
        current.update(elapsed)
        if (current.alpha !== 1) {
            current.alpha += alpha
            if (current.alpha > 1) {
                current.alpha = 1
            }
        }
        if (this.old) {
            this.old.alpha -= alpha
            if (this.old.alpha <= 0) {
                view.states.removeChild(this.old)
                this.old = null
            }
        }
    }
}

export const state = new State()