export default {
    entry: 'dist/index.js',
    dest: 'dist/bundles/angular2-knob.umd.js',
    sourceMap: false,
    format: 'umd',
    moduleName: 'KnobModule',
    globals: {
        '@angular/core': 'ng.core',
        'd3': 'd3'
    },
    external: [
        '@angular/core',
        'd3'
    ]

}