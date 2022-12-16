import View3D from "@egjs/view3d";

function main() {
    const canvas = document.querySelector('#c') as HTMLElement;
    const view3d = new View3D(canvas, {src: 'cube.glb'})
}

main();
