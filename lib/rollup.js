const ts = require('typescript');
const rollup = require('rollup');
const commonjs = require('rollup-plugin-commonjs');
const license = require('rollup-plugin-license');
const path = require('path');
const fs = require('fs-extra');
const glob = require('glob');

module.exports = js = (config, prod) => {
    const setting = config.rollupConfig;
    const input = path.join(config.srcDir, (config.targetFileName + config.targetFileTest));    

    const output_dev = path.join(config.distDir, (config.targetFileName + setting.dev.fileName));
    const output_prod = path.join(config.distDir, (config.targetFileName + setting.prod.fileName));
    
    const format_dev = setting.dev.format;
    const format_prod = setting.prod.format;

    const sourseCodes = () => {
        return new Promise((resolve, reject) => {
            glob(path.join(config.srcDir, '**/*.ts'), (err, pathes) => {
                const codes = pathes.map(path => {
                    return fs.readFile(path).then(buf => {
                        return {
                            path:path,
                            code: buf.toString(),
                        }
                    });
                });
                resolve(Promise.all(codes));
            });
        });
    };

    const compileTsToEs5 = (codes) => {
        return new Promise((resolve, reject) => {
            const results = codes.map(code => {
                const codeStr = code.code;

                const result = ts.transpileModule(codeStr, {
                    noEmitOnError:true,
                    target: 'ES5',
                    module: 'ES6'
                });
                
                code.outputText = result.outputText;
                
                return code;
            });

            resolve(results);
        });
    };

    const outputPreProsessJsFile = (codes) => {
        return new Promise((resolve, reject) => {
            const result = codes.map(code => {
                const outputText = code.outputText;

                const outputPath = path.join('src/preprosess/', code.path.replace(/src/g, '').replace(/.ts/, '.js'));
                
                return fs.outputFile(outputPath, outputText).then(() => {
                    code.preprosessFilePath = outputPath;
                    return code;
                });
            });
            resolve(Promise.all(result));
        });
    }; 

    return sourseCodes().then(codes => compileTsToEs5(codes))
        .then(codes => outputPreProsessJsFile(codes))
        .then(outputData => {

            const entryFileData = outputData.filter(data => data.path.match(config.targetFileName))[0];
            const entryFilePath = entryFileData.preprosessFilePath;

            const rollupPluginDefault = [
                commonjs(),
            ];

            const rollupLicense = license({
                banner: {
                    file: path.join('./config', 'banner.txt'),
                    encoding: 'utf-8',
                }
            });

            if (prod) {
                rollupPluginDefault.push(rollupLicense);
            }

            const bund = rollup.rollup({
                input: entryFilePath,
                plugins: rollupPluginDefault,
            });

            return bund.then(then => then.generate({
                format: (prod) ? format_prod : format_dev
                }))
                .then(then => {
                    const code = then.output[0].code;
                    return new Promise((resolve, reject) => {
                        const path = (prod) ? output_prod : output_dev;
                        fs.outputFile(path, code, err => {
                            if (err) reject(err);
                            resolve({
                                status: `${(prod) ? 'production build' : 'develop build'} success`,
                                path: path,
                                input: input,
                            });
                       });
                    });
                });
        });
};