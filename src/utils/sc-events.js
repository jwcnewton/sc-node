const events = require('events'),
    EventEmitter = events.EventEmitter;

const emitter = function() {
    if (arguments.callee._singletonInstance )
        return arguments.callee._singletonInstance;
    arguments.callee._singletonInstance = this;  
    EventEmitter.call(this);
};

emitter.prototype.__proto__ = EventEmitter.prototype;

module.exports = new emitter();