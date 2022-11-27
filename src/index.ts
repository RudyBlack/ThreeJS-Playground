import * as THREE from "three";
import {DirectionalLight} from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {RenderPass} from "three/examples/jsm/postprocessing/RenderPass";
import {UnrealBloomPass} from "three/examples/jsm/postprocessing/UnrealBloomPass";
import {EffectComposer} from "three/examples/jsm/postprocessing/EffectComposer";
import {ShaderPass} from "three/examples/jsm/postprocessing/ShaderPass";
import {FXAAShader} from "three/examples/jsm/shaders/FXAAShader";

function main() {
    const canvas = document.querySelector('#c') as HTMLElement;
    const renderer = new THREE.WebGLRenderer({canvas, antialias: true});
    renderer.setPixelRatio(window.devicePixelRatio);

    const fov = 45;
    const aspect = 2;  // the canvas default
    const near = 0.1;
    const far = 100;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);


    // camera.position.set(-8.091345887097559, 5.944826171937494, 7.598131322862585); // 물체 aa 확인용
    camera.position.set(-3.3550, 15.16766, 17.617); // 라이트 aa 확인용

    const controls = new OrbitControls(camera, canvas);
    controls.target.set(0, 5, 0);
    controls.update();

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('black');


    function plane() {
        // const planeSize = 40;
        //
        // const loader = new THREE.TextureLoader();
        // const texture = loader.load('https://r105.threejsfundamentals.org/threejs/resources/images/checker.png');
        // texture.wrapS = THREE.RepeatWrapping;
        // texture.wrapT = THREE.RepeatWrapping;
        // texture.magFilter = THREE.NearestFilter;
        // const repeats = planeSize / 2;
        // texture.repeat.set(repeats, repeats);
        //
        // const planeGeo = new THREE.PlaneBufferGeometry(planeSize, planeSize);
        // const planeMat = new THREE.MeshPhongMaterial({
        //     map: texture,
        //     side: THREE.DoubleSide,
        // });
        // const mesh = new THREE.Mesh(planeGeo, planeMat);
        // mesh.rotation.x = Math.PI * -.5;
        // scene.add(mesh);
    }

    function cube() {
        const cubeSize = 4;
        const cubeGeo = new THREE.BoxBufferGeometry(cubeSize, cubeSize, cubeSize);
        const cubeMat = new THREE.MeshPhongMaterial({color: '#8AC'});
        const mesh = new THREE.Mesh(cubeGeo, cubeMat);
        mesh.position.set(cubeSize + 1, cubeSize / 2, 0);
        scene.add(mesh);
    }

    function sphere() {

        const sphereRadius = 3;
        const sphereWidthDivisions = 32;
        const sphereHeightDivisions = 16;
        const sphereGeo = new THREE.SphereBufferGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);
        const sphereMat = new THREE.MeshPhongMaterial({color: '#CA8'});
        const mesh = new THREE.Mesh(sphereGeo, sphereMat);
        mesh.position.set(-sphereRadius - 1, sphereRadius + 2, 0);
        scene.add(mesh);
    }

    cube()
    sphere()
    {
        new GLTFLoader().load('cube.glb', function (gltf) {

            const model = gltf.scene;

            scene.add(model);

            const scale = 3;

            model.scale.set(scale, scale, scale);

            gltf.scene.traverse(child => {

                // @ts-ignore
                if (child.material) child.material.metalness = 0.5;

            });

        });
    }


    const renderScene = new RenderPass(scene, camera);

    const params = {
        exposure: 1,
        bloomStrength: 0.5,
        bloomThreshold: 0.9,
        bloomRadius: 0.3
    };

    const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
    bloomPass.threshold = params.bloomThreshold;
    bloomPass.strength = params.bloomStrength;
    bloomPass.radius = params.bloomRadius;

    const fxaaPass = new ShaderPass(FXAAShader);

    const width = window.innerWidth;
    const height = window.innerHeight;

    const pixelRatio = renderer.getPixelRatio();


    const resolution_x = 1 / (window.innerWidth * pixelRatio);
    const resolution_y = 1 / (window.innerHeight * pixelRatio);
    fxaaPass.material.uniforms['resolution'].value.x = resolution_x;
    fxaaPass.material.uniforms['resolution'].value.y = resolution_y;

    const composer = new EffectComposer(renderer);
    composer.setSize(width, height);

    composer.addPass(renderScene);
    composer.addPass(bloomPass);
    composer.addPass(fxaaPass);

    {
        const color = 0xFFFFFF;
        const intensity = 1;
        const light = new THREE.AmbientLight(color, intensity);
        scene.add(light);
    }
    {
        const color = 0xffffff;
        const intensity = 1;
        const light = new DirectionalLight(color, intensity);
        scene.add(light);
    }


    function resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            renderer.setSize(width, height, false);

        }
        return needResize;
    }

    function render() {

        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }

        // renderer.render(scene, camera);

        composer.render();
        requestAnimationFrame(render);
    }


    requestAnimationFrame(render);


}

main();
