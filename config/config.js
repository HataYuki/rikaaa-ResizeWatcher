module.exports = {
    srcDir: 'src',
    distDir: './',
    targetFileName: 'rikaaa-ResizeWatcher',
    targetFileTest:'.ts',
    
    rollupConfig: {
        dev: {
            fileName: '.dev.js',
            format:'cjs',
        },
        prod: {
            fileName: '.js',
            format:'esm',
        }
    },
    
    karmaConfig: {
        frameworks: ['mocha', 'browserify'],
        port: 9876,
        browsers: ['Chrome', 'Safari', 'Firefox'],
        files: [
            'spec/*.test.html',
            'spec/*.test.js',
            'karma-debughtml-refresh.js',
        ],
        preprocessors: {
            'spec/*.test.html': ['html2js'],
            'spec/*.test.js': ['browserify'],
        },
        browserify: {
            transform: [
                ['babelify', {
                   presets: ['babel-preset-env']
                }]
            ]
        },
        html2JsPreprocessor: {
            stripPrefix: 'spec/',
        },
        client: {
            mocha: {
                timeout: 100000,
            }
        }
    }
}