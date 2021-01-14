/* Copyright (c) 2020 YOPEY YOPEY LLC */

const { performance } = require('perf_hooks')
const fs = require('fs-extra')
const readLines = require('n-readlines')
const path = require('path')
const chokidar = require('chokidar')
const esbuild = require('esbuild').build
const cuid = require('cuid')
const express = require('express')
const WebSocket = require('ws')

const packageJSON = require('../package.json')

const port = 1234
const websocketPort = 1235
const linesToShow = 3
const excludes = []

let _cache
let _dir
let _css
let _wss

function addZero(s) {
    if (s.length !== 2) {
        return `0${s}`
    } else {
        return s
    }
}

function log(s) {
    const time = new Date()
    let hours = time.getHours()
    let pm = false
    if (hours > 12) {
        hours -= 12
        pm = true
    }
    console.log(`[${hours}:${addZero(time.getMinutes())}${pm ? 'pm' : 'am'}]`, s)
}

async function css(dir) {
    const files = await fs.readdir(dir, { withFileTypes: true })
    for (const file of files) {
        if (file.isDirectory()) {
            await css(dir + file.name + '/')
        } else if (path.extname(file.name) === '.css') {
            const data = await fs.readFile(dir + file.name)
            _css += data
        }
    }
    _css = _css.replaceAll('  ', '')
    _css = _css.replaceAll(': ', ':')
    _css = _css.replaceAll('\n', '')
}

async function buildCss() {
    _css = ''
    await css('code/')
    await fs.outputFile(`${_dir}index.${_cache}.css`, _css)
    log('packaged css.')
}

// from https://stackoverflow.com/a/43532829/1955997
function roundTo(value, digits) {
    value = value * Math.pow(10, digits)
    value = Math.round(value)
    value = value / Math.pow(10, digits)
    return value
}

async function buildJs(minify) {
    const now = performance.now()
    try {
        await esbuild({
            entryPoints: ['code/main.js'],
            inject: ['generate/live.js'],
            bundle: true,
            outfile: `${_dir}/index.${_cache}.js`,
            minify,
            sourcemap: !minify,
        })
        log(`packaged javascript (${roundTo(performance.now() - now, 2)}ms).`)
    } catch(e) {
        log('error compiling javascript.')
        let s = ''
        for (const error of e.errors) {
            const lines = new readLines(error.location.file)
            let i = 1, line
            while (line = lines.next()) {
                if (i >= error.location.line - linesToShow && i <= error.location.line + linesToShow) {
                    if (i === error.location.line) {
                        let actual = line.toString()
                        actual = `${actual.substr(0, error.location.column)}` +
                            `<span style="background:red">${actual.substr(error.location.column, error.location.length)}</span>` +
                            actual.substr(error.location.column + error.location.length)
                        s += `<div style="background:blue;color:white">${actual}</div>`
                    } else {
                        s += line.toString() + '<br>'
                    }
                }
                i++
            }
        }
        const script = `window.addEventListener('load', () => {
            document.body.style.background = 'white'
            document.body.style.fontFamily = 'Consolas,monaco,monospace'
            document.body.style.margin = '1rem'
            document.body.style.width = 'auto'
            document.body.style.height = 'auto'
            document.body.innerHTML = \`${e.toString().replaceAll('\n', '<br>')}<br><br>${s}\`
        });` + await fs.readFile('generate/live.js')
        await fs.outputFile(`${_dir}/index.${_cache}.js`, script)
    }
}

async function clean() {
    await fs.emptyDir(_dir)
}

async function assets() {
    const files = await fs.readdir('public')
    for (const file of files) {
        if (file === 'index.html') {
            let index = await fs.readFile('public/index.html') + ''
            index = index.replace('{{css}}', `<link rel="stylesheet" href="index.${_cache}.css">`)
            index = index.replace('{{script}}', `<script src="index.${_cache}.js"></script>`)
            index = index.replaceAll('{{title}}', packageJSON.title)
            await fs.outputFile(`${_dir}index.html`, index)
        } else {
            await fs.copyFile(`public/${file}`, `${_dir}${file}`)
        }
    }
}

async function music() {
    log(`Copied ${files.length} assets.`)
    const music = await fs.readdir('music')
    await fs.emptyDir(`${_dir}music`)
    for (let i = 0; i < music.length; i++) {
        const file = music[i]
        await fs.copyFile(`music/${file}`, `${_dir}music/${i}.mp3`)
    }
    log(`Copied ${music.length} music assets.`)
}

async function sounds() {
    const sounds = await fs.readdir('sounds')
    await fs.emptyDir(`${_dir}sounds`)
    let count = 0
    for (let i = 0; i < sounds.length; i++) {
        const file = sounds[i]
        if (file.includes('.mp3')) {
            count++
            await fs.copyFile(`sounds/${file}`, `${_dir}sounds/${file}`)
        }
    }
    log(`Copied ${count} sound assets.`)
}

async function build() {
    _cache = cuid.slug()
    _dir = 'www/'
    await clean()
    await assets()
    // await sounds()
    // await music()
    await buildCss()
    await buildJs()
}

async function production() {
    _cache = cuid.slug()
    _dir = 'dist/'
    await clean()
    await assets()
    // await sounds()
    // await music()
    await buildCss()
    await buildJs(true)
    log(`${packageJSON.name} v${packageJSON.version} deployed to ${_dir}`)
    process.exit(0)
}

function httpServer() {
    const app = express()
    app.use('/', express.static(_dir))
    app.listen(port, () => log(`${packageJSON.name} v${packageJSON.version} running at http://localhost:${port}`))
}

function webSocketServer() {
    _wss = new WebSocket.Server({
        port: websocketPort,
    })
    log(`Live reload socket server running on port ${websocketPort}`)
}

function signalSockets() {
    _wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send()
        }
    })
}

async function serve() {
    await build()
    const jsWatch = chokidar.watch(['code/**/*.js', 'script/*.js', 'images/*.json'])
    jsWatch.on('change', async file => {
        if (!excludes.includes(file) && !file.includes('.editor.json')) {
            log(`${file} changed...`)
            await buildJs()
            signalSockets()
        }
    })
    const cssWatch = chokidar.watch('code/**/*.css')
    cssWatch.on('change', async () => {
        await buildCss()
        signalSockets()
    })
    httpServer()
    webSocketServer()
}

if (process.argv[2] === '--production') {
    production()
} else {
    serve()
}
