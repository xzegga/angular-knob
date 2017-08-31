export default {
    entry: 'dist/index.js',
    dest: 'dist/bundles/angular2-knob.umd.js',
    sourceMap: false,
    format: 'umd',
    moduleName: 'KnobModule',
    globals: {
        'd3': 'd3'
    },
    external: [
        'd3'
    ]

}