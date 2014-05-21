#!/usr/bin/env node

var fs = require('fs');
var Image = require('node-image-2').Image;
var osmesa = require('../index');

var context = osmesa.CreateContext();

var width = 800, height = 800, bpp = 32;
var buffer = new Uint8Array(width * height * bpp / 8);
osmesa.MakeCurrent(context, buffer, width, height);

var gl = osmesa;
gl.clearColor(0.7, 0.8, 0.9, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);
gl.finish();

osmesa.DestroyContext(context);


function swapRedAndBlue(buffer) {
	var pixels = buffer.length / 4;
	for (var i = 0; i < pixels; ++i) {
		var r = buffer[i*4];
		var b = buffer[i*4+2];
		buffer[i*4] = b;
		buffer[i*4+2] = r;
	}
}

swapRedAndBlue(buffer);
var imgObject = Image.convertFromRawBits(buffer, width, height);
var compressedBuffer = imgObject.saveToMemory(Image.FIF_JPEG);

fs.writeFileSync('output.jpg', compressedBuffer);
