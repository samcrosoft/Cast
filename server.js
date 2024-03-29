require('colors');
var wait = require('wait.for');

console.log('Cast 1.0 '.rainbow + 'Beta 2'.bold);

global.localdir = __dirname;
global.cast = {};

var fs = require('fs');
try {
    global.config = JSON.parse(fs.readFileSync(global.localdir + '/config.json', 'utf8'));
} catch (error) {
    console.error('Failed to load the config file. Are you sure you have a valid config.json?'.red);
    console.error('The error was:', error.message.grey);
    process.exit(1);
}

try {
    global.cast.version = JSON.parse(fs.readFileSync(global.localdir + '/package.json', 'utf8')).version;
} catch (error) {
    console.error('Failed to load the config file. Are you sure you have a valid config.json?'.red);
    console.error('The error was:', error.message.grey);
    process.exit(1);
}

var loadCast = function loadCast () {
    global.app = require('./intern/HTTP/server.js');
    global.hooks = require('./hooks/hooks.js');
    global.hooks.loadModules();
};

if (global.config.startUpScript) { // run a script before going on eg. to load the configuration from a network disk
    wait.launchFiber(function () {
        var start = require(global.localdir + '/start.js');
        wait.for(start);
        loadCast();
    });
} else {
    loadCast();
}
