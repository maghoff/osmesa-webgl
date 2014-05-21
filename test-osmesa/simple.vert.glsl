#ifdef GL_ES
precision mediump float;
#endif

attribute vec2 vertex;

void main(void) {
	gl_Position = vec4(vertex, 0, 1);
}
