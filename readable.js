var stream = require('stream');
var util = require('util');
var mouse = require('osx-mouse');
var once = require('once');

var noop = function() {};

var ReadableMouseStream = function() {
	if(!(this instanceof ReadableMouseStream)) return new ReadableMouseStream();
	stream.Readable.call(this, { objectMode: true });

	var self = this;

	this._mouse = null;
	this._destroyed = false;

	this._initialize = once(function() {
		var on = function(type) {
			self._mouse.on(type, function(x, y) {
				self.push({
					type: type,
					time: Date.now(),
					x: x,
					y: y
				});
			});
		};

		self._mouse = mouse();

		on('move');
		on('left-down');
		on('left-up');
		on('left-drag');
		on('right-down');
		on('right-up');
		on('right-drag');
	});
};

util.inherits(ReadableMouseStream, stream.Readable);

ReadableMouseStream.prototype.destroy = function(err) {
	if(this._destroyed) return;
	this._destroyed = true;

	var self = this;
	var onclose = function() {
		self.emit('close');
	};

	if(err) this.emit('error', err);
	if(!this._mouse) return onclose();

	this._mouse.destroy(onclose);
	this._mouse = null;
};

ReadableMouseStream.prototype._read = function() {
	this._initialize();
};

module.exports = ReadableMouseStream;
