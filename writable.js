var stream = require('stream');
var util = require('util');
var mouse = require('macmouse');
var once = require('once');

var ref = 0;

var initialize = function() {
	if(ref++) return;
	mouse.init();
};

var destroy = function() {
	if(--ref) return;
	mouse.quit();
};

var update = function(type, x, y) {
	mouse.Place(x, y);

	if(type === 'left-down') mouse.LeftButtonPress();
	else if(type === 'left-up') mouse.LeftButtonRelease();
	else if(type === 'right-down') mouse.RightButtonPress();
	else if(type === 'right-up') mouse.RightButtonRelease();
};

var WritableMouseStream = function() {
	if(!(this instanceof WritableMouseStream)) return new WritableMouseStream();
	stream.Writable.call(this, { objectMode: true });

	var self = this;

	this._destroyed = false;
	this._initialized = 0;
	this._first = 0;

	self._initialize = once(function(data) {
		initialize();
		self._initialized = Date.now();
		self._first = data.time;
	});
};

util.inherits(WritableMouseStream, stream.Writable);

WritableMouseStream.prototype.destroy = function(err) {
	if(this._destroyed) return;
	this._destroyed = true;

	if(err) self.emit(err);
	if(this._initialized) destroy();
	this.emit('close');
};

WritableMouseStream.prototype._write = function(data, encoding, callback) {
	this._initialize(data);

	var type = data.type;
	var time = data.time;
	var x = data.x;
	var y = data.y;

	var dt = time - this._first;
	dt = (this._initialized + dt) - Date.now();

	if(dt < 10) {
		update(type, x, y);
		return callback();
	}

	setTimeout(function() {
		update(type, x, y);
		callback();
	}, dt);
};

module.exports = WritableMouseStream;
