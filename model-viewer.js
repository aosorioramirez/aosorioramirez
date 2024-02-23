//import { nombresProyectos } from "index.js";

const nombresProyectos = [
    {'name': "CASA REFUGIO",'number': "1"},
    {'name': "TFM ESTRUCTURAS",'number': "2"},
    {'name': "LÁMPARA FUENTE",'number': "3"},
    {'name': "MESA FLOTANTE",'number': "4"},
    {'name': "MACETERO CEMENTO",'number': "5"}
];

import {
    AmbientLight,
    AxesHelper,
    DirectionalLight,
    GridHelper,
    PerspectiveCamera,
    Scene,
    WebGLRenderer,
    BoxGeometry,
    MeshPhongMaterial,
    Mesh,
    Raycaster,
    Vector2
} from "three";


// import * as THREE from 'three';

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
  
import { IFCLoader } from "web-ifc-three/IFCLoader.js";

import { computeBoundsTree, disposeBoundsTree, acceleratedRaycast } from "three-mesh-bvh";

import { MeshLambertMaterial } from "three";

//Creates the Three.js scene
const scene = new Scene();

  
//Object to store the size of the viewport
const threeCanvas = document.getElementById("three-canvas");
const canvasRect = {
    width: threeCanvas.offsetWidth,
    height: threeCanvas.offsetHeight
};
const marginRatio = 0.95;

// const windowRect = window.getBoundingClientRect();
// console.log(windowRect);
//console.log(canvasRect);


 
//Creates the camera (point of view of the user)
const camera = new PerspectiveCamera(75, canvasRect.width / canvasRect.height);
camera.position.z = 15;
camera.position.y = 13;
camera.position.x = 8;
  
//Creates the lights of the scene
const lightColor = 'white';
  
const ambientLight = new AmbientLight(lightColor, 0.2);
scene.add(ambientLight);
  
const directionalLight = new DirectionalLight(lightColor, 1);
directionalLight.position.set(10, 10, 5);
scene.add(directionalLight);
  
//Sets up the renderer, fetching the canvas of the HTML
const renderer = new WebGLRenderer({ canvas: threeCanvas, alpha: true });
renderer.setSize(canvasRect.width, canvasRect.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));


//Creates grids and axes in the scene
const grid = new GridHelper(50, 30);
scene.add(grid);
  
const axes = new AxesHelper();
axes.material.depthTest = false;
axes.renderOrder = 1;
scene.add(axes);
  
//Creates the orbit controls (to navigate the scene)
const controls = new OrbitControls(camera, threeCanvas);
controls.enableDamping = true;
controls.target.set(-2, 0, 0);
  
//Animation loop
const animate = () => {
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
};
  
animate();

console.log(window.innerWidth);
  
//Adjust the viewport to the size of the browser
window.addEventListener("resize", () => {
    const windowX = window.innerWidth * marginRatio;

    if (threeCanvas.width !== windowX) {
        renderer.setSize(windowX, canvasRect.height);
        camera.aspect = windowX / canvasRect.height;
        camera.updateProjectionMatrix();
    } return;
});

function widthResizer() {
    const windowX = window.innerWidth;
    console.log(windowX);
}

window.addEventListener('resize', widthResizer);



// IFC Loading

const ifcLoader = new IFCLoader();

ifcLoader.ifcManager.setupThreeMeshBVH( computeBoundsTree, disposeBoundsTree, acceleratedRaycast);
  
ifcLoader.ifcManager.applyWebIfcConfig({COORDINATE_TO_ORIGIN: true});

// const excludedCats = [
//     WEBIFC.IFCMASS
// ];

// for(const cat of excludedCats) {
//     ifcLoader.ifcManager.excludeCats.add(cat);
// }

const geometrybox = new BoxGeometry(1, 1, 1);
const material = new MeshPhongMaterial( {color: '#00ff66'} );

const cubeMesh = new Mesh( geometrybox, material );
scene.add( cubeMesh );



const ifcModels = [];

const input = document.getElementById("file-input");
input.addEventListener(
      "change",
      async (changed) => {
          const ifcURL = URL.createObjectURL(changed.target.files[0]);
          const model = await ifcLoader.loadAsync(ifcURL);
          scene.add(model);
          ifcModels.push(model);
      },
      false
);

async function loadIfc() {
	const ifcLoader = new IFCLoader();
	const autoModel = await ifcLoader.loadAsync("./loaders/01.ifc");
	scene.add(autoModel);
}

loadIfc();



const raycaster = new Raycaster();
raycaster.firstHitOnly = true;
const mouse = new Vector2();

function cast(event) {
    const bounds = threeCanvas.getBoundingClientRect();

    const x1 = event.clientX - bounds.left;
    const x2 = bounds.right - bounds.left;
    mouse.x = (x1 / x2) * 2 - 1;

    const y1 = event.clientY - bounds.top;
    const y2 = bounds.bottom - bounds.top;
    mouse.y = - (y1 / y2) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    return raycaster.intersectObjects(ifcModels);
}

const preselectMat = new MeshLambertMaterial({
    transparent: true,
    opacity: 0.6,
    color: 0xccccff,
    depthTest: false
});

let preselectModel = {id: -1};

function highlight (event, material, model) {
    const found = cast(event)[0];
    if(found) {
        // Gets model ID
        model.id = found.object.modelID;

        // Gets Express ID
        const index = found.faceIndex;
        const geometry = found.object.geometry;
        const id = ifcLoader.ifcManager.getExpressId(geometry, index);

        // Creates Subset
        ifcLoader.ifcManager.createSubset({
            modelID: model.id,
            ids: [id],
            material: material,
            scene: scene,
            removePrevious: true
        })
               
    } else {
        // Removes previous highlight
        ifcLoader.ifcManager.removeSubset(model.id, material);
    }
}

window.onmousemove = (event) => highlight (event, preselectMat, preselectModel);

const selectMat = new MeshLambertMaterial({
    transparent: true,
    opacity: 0.6,
    color: 0xffdd00,
    depthTest: false 
});

const selectModel = {id: -1};

window.onclick = (event) => highlight(event, selectMat, selectModel);


// 9 Debugging

// const gui = new GUI();