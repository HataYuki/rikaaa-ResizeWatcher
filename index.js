const config = require('./config/config');
const karma = require('./lib/karma');
const rollup = require('./lib/rollup');
const path = require('path');
const gaze = require('gaze');
const cmd = process.argv[2];


const dev = () => {
    js(config, false).then(then => {
        console.log(then);
        let timer = null
        const karmaconfig = config.karmaConfig;
        const k = karma(karmaconfig);
        gaze(path.join(config.srcDir, '**/*.ts'), function (err, watcher) {
            this.on('changed', (filepath) => {
                clearTimeout(timer);
                timer = setTimeout(function () {
                    js(config, false);
                },2000);
            });
        });
        // gaze(path.join(config.srcDir, '**/*'), (err, watcher) => {
        //     this.on('changed', () => {
        //        console.log('change');
                
        //     });
        //     // if (err) console.log(err);
        //     // watcher.on('all', async (ev, file) => {
        //     //     clearTimeout(timer);
        //     //     timer = setTimeout(() => {
        //     //         js(config, false);
        //     //     },1000);
        //     // });
        // });
    });
};

const prod = () => {
    js(config, true).then(then => {
        console.log(then.status);
    });
}

switch (cmd) {
    case 'dev':
        dev();
        break;
    case 'prod':
        prod();
        break;
}





