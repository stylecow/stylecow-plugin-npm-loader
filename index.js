"use strict";

let findup = require('findup-sync');
let fs     = require('fs');
let path   = require('path');

module.exports = function (tasks, stylecow) {

    let nodeModules;

    tasks.addTask({
        position: 'before',
        fn: function (root) {
            let cwd = root.getData('file');

            if (cwd) {
                nodeModules = findup('node_modules', { cwd: path.dirname(cwd) });
            }
        }
    });

    tasks.addTask({
        filter: {
            type: 'AtRule',
            name: 'import'
        },
        fn: function (atRule) {
            if (!nodeModules || atRule.data['npm-loaded']) {
                return;
            }

            let root = atRule.getAncestor('Root').getData('file');

            if (!root) {
                return;
            }

            root = path.dirname(root);
            let name = path.basename(atRule.get('String').name), packageDir, style;

            try {
                let packageFile = path.join(nodeModules, name, 'package.json');
                fs.statSync(packageFile);
                style = JSON.parse(fs.readFileSync(packageFile)).style;
                packageDir = path.dirname(packageFile);
            } catch (err) {
                return;
            }

            if (!style) {
                return;
            }

            if (typeof style === 'string') {
                style = [style];
            }

            style = style
                .filter(file => path.extname(file) === '.css')
                .map(file => path.relative(root, path.join(packageDir, file)));

            if (!style.length) {
                tasks.log(`Npm module ${name} has no styles`, atRule);
            } else {
                style.forEach(function (file) {
                    let newImport = stylecow.parse(`@import url("${file}")`, 'AtRule');
                    newImport.setData('npm-loaded', true);
                    atRule.before(newImport);
                });
            }

            atRule.detach();
        }
    });
};
