# osx-mouse-stream

Streaming mouse events for OS X. Built using [osx-mouse](https://github.com/kapetan/osx-mouse) module.

	npm install osx-mouse-stream

# Usage

By default the module exposes a readable stream of mouse input events.

```javascript
var readableMouse = require('osx-mouse-stream');
var JSONStream = require('JSONStream');

readableMouse()
	.pipe(JSONStream.stringify(false))
	.pipe(process.stdout);
```

The above would output an object of the following format.

```javascript
{
	type: 'move',
	time: 1431187372523,
	x: 0,
	y: 0
}
```

The `osx-mouse` module provides a full list of available event types.

It's also possible to create a writable stream which accepts the described object format, and executes the mouse commands using the [macmouse](https://github.com/Loknar/node-macmouse) module.

```javascript
var writableMouse = require('osx-mouse-stream/writable');
var stream = writableMouse();

stream.write({
	type: 'move',
	time: 1431187372523,
	x: 0,
	y: 0
});
```

# Command-line

The command-line tool can be used to record and replay mouse events.

```
mouse-stream > log
```

Pipe the file back into the cli.

```
cat log | mouse-stream --no-output
```

The `--no-output` and `--no-input` options disable the readable and writable part of the cli.

With [airpaste](https://github.com/mafintosh/airpaste) it's possible to take control of the mouse on another OS X machine.

```
mouse-stream | airpaste
```

```
airpaste | mouse-stream --no-output
```
