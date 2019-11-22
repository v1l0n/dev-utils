const chalk = require('chalk');

exports.log = function log(message, type='info') {
    let logHeader = chalk.blue('[VLN] ');

    switch (type) {
        case 'error':
            logHeader += chalk.red('ERR!');
            break;
        case 'warning':
            logHeader += chalk.yellow('WARN');
            break;
        default:
            logHeader += chalk.black.bgWhite('INFO');
            break;
    }

    console.log(`${logHeader} ${message}`);
}

exports.warn = function(message) { this.log(message, 'waring') }

exports.err = function(message) { this.log(message, 'error') }
