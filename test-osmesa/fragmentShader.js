#!/usr/bin/env node

var fs = require('fs');
var Image = require('node-image-2').Image;
var osmesa = require('../index');

var context = osmesa.CreateContext();

var width = 800, height = 800, bpp = 32;
var buffer = new Uint8Array(width * height * bpp / 8);
osmesa.MakeCurrent(context, buffer, width, height);

var gl = osmesa;


function compileShader(gl, type, source) {
	var shader = gl.createShader(type);
	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {  
		throw new Error("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
	}
	return shader;
}

function shaderBuilder(spec) {
	var gl = spec.gl;

	var program = gl.createProgram();

	gl.attachShader(program, compileShader(gl, gl.VERTEX_SHADER, spec.vertex));
	gl.attachShader(program, compileShader(gl, gl.FRAGMENT_SHADER, spec.fragment));

	for (var attrib in spec.attributes) {
		if (!spec.attributes.hasOwnProperty(attrib)) continue;
		gl.bindAttribLocation(program, spec.attributes[attrib], attrib);
	}

	gl.linkProgram(program);
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		throw new Error("Unable to link the shader program");
	}

	var uniforms = {};
	spec.uniforms.forEach(function (uniform) {
		uniforms[uniform] = gl.getUniformLocation(program, uniform);
	});

	return {
		program: program,
		attributes: spec.attributes,
		uniforms: uniforms
	};
}

var shader = shaderBuilder({
	gl: gl,
	vertex: fs.readFileSync('simple.vert.glsl', 'utf-8'),
	fragment: fs.readFileSync('effect.frag.glsl', 'utf-8'),
	attributes: {
		vertex: 0
	},
	uniforms: []
});

gl.useProgram(shader.program);

var arraybuffer = gl.createBuffer();

gl.bindBuffer(gl.ARRAY_BUFFER, arraybuffer);
var data = [
	-1, -1,
	-1,  1,
	 1,  1,
	 1, -1
];
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STREAM_DRAW);
gl.enableVertexAttribArray(shader.attributes.vertex);
gl.vertexAttribPointer(shader.attributes.vertex, 2, gl.FLOAT, false, 4*2, 0);

gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);


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
