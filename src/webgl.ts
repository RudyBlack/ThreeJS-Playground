export const vertexShaderString = `

attribute vec4 a_position;

void main(){
    gl_Position = a_position;
}
`

export const fragmentShaderString = `
    precision mediump float;
    
    void main(){
        gl_FragColor = vec4(255, 255, 255, 1);
    }
`
