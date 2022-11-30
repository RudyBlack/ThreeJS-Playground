import {fragmentShaderString, vertexShaderString} from "./webgl";

const canvas = document.querySelector("#c") as HTMLCanvasElement;
const gl = canvas.getContext("webgl");

function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        return shader;
    }

    gl.deleteShader(shader);
}

function createProgram(gl, vertexShader, fragmentShader) {
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
        return program;
    }

    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}

function resizeCanvasToDisplaySize(canvas, multiplier = 1) {
    multiplier = multiplier || 1;
    const width  = canvas.clientWidth  * multiplier | 0;
    const height = canvas.clientHeight * multiplier | 0;
    if (canvas.width !== width ||  canvas.height !== height) {
        canvas.width  = width;
        canvas.height = height;
        return true;
    }
    return false;
}

resizeCanvasToDisplaySize(gl.canvas);

function init(){
    gl.viewport(0,0, gl.canvas.width, gl.canvas.height);

// Clear the canvas
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Tell it to use our program (pair of shaders)
    gl.useProgram(program);
// Turn on the attribute
    gl.enableVertexAttribArray(positionAttributeLocation);
}


const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderString);
const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderString);
const program = createProgram(gl, vertexShader, fragmentShader);
const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
init();

const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

// three 2d points
const positions = [
    0, 0,
    0, 1,
    0.5, -0.7,
    0.2, -0.9,
    // 0,0
];

gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);


// Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
const size = 2;          // 2 components per iteration
const type = gl.FLOAT;   // the data is 32bit floats
const normalize = false; // don't normalize the data
const stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
const offset = 0;        // start at the beginning of the buffer

gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);

// draw
const primitiveType = gl.TRIANGLES;
const count = 4;
gl.drawArrays(primitiveType, 0, count);


