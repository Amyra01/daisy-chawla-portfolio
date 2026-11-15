import 'dotenv/config'
import restart from 'vite-plugin-restart'
import wasm from 'vite-plugin-wasm'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default {
    root: 'sources/',
    envDir: '../',
    publicDir: '../static/',
    base: './',
    server:
    {
        port: 5180,
        host: true,
        open: false
    },
    build:
    {
        outDir: '../dist',
        emptyOutDir: true,
        sourcemap: false
    },
    plugins:
    [
        wasm(),
        restart({ restart: [ '../static/**', ] }),
        nodePolyfills(),
    ]
}
