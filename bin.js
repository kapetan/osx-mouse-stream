#!/usr/bin/env node

var JSONStream = require('JSONStream');
var minimist = require('minimist');

var readableMouseStream = require('./readable');
var writableMouseStream = require('./writable');

var argv = minimist(process.argv.slice(2), {
	boolean: ['input', 'output'],
	default: { input: true, output: true }
});

if(argv.input) {
	process.stdin
		.pipe(JSONStream.parse())
		.pipe(writableMouseStream());
}
if(argv.output) {
	readableMouseStream()
		.pipe(JSONStream.stringify(false))
		.pipe(process.stdout);
}
