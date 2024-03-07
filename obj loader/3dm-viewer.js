import {
  AmbientLight,
  AxesHelper,
  DirectionalLight,
  GridHelper,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  MeshBasicMaterial,
  BoxGeometry,
  MeshPhongMaterial,
  Mesh,
  Raycaster,
  Vector2,
  MeshLambertMaterial,
  Color,
  Object3D,
  BasicShadowMap,
  DirectionalLightHelper,
  PlaneGeometry,
  CircleGeometry,
  DoubleSide,
  PCFShadowMap,
  SphereGeometry,
  PCFSoftShadowMap,
  VSMShadowMap,
  EdgesGeometry,
  LineSegments,
  LineBasicMaterial
} from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import { OBJLoader } from "three/addons/loaders/OBJLoader.js";

import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";

import { Rhino3dmLoader } from "three/examples/jsm/loaders/3DMLoader.js";


let USE_WIREFRAME = false;

//Creates the Three.js scene
Object3D.DEFAULT_UP.set( 0, 0, 1 );
const scene = new Scene();

//Object to store the size of the viewport
const threeCanvas = document.getElementById("three-canvas");
const canvasRect = {
  width: threeCanvas.offsetWidth,
  height: threeCanvas.offsetHeight,
};
const marginRatio = 0.95;

scene.background = new Color(0xffffff);

//Sets up the renderer, fetching the canvas of the HTML
const renderer = new WebGLRenderer({ canvas: threeCanvas, alpha: true });
renderer.setSize(canvasRect.width, canvasRect.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = PCFShadowMap;
renderer.shadowMap.setSize = 2048;

//Creates the camera (point of view of the user)
const camera = new PerspectiveCamera(50, canvasRect.width / canvasRect.height);
camera.position.x = -20;
camera.position.y = -40;
camera.position.z = 20;


// BASE

let rhinoMaterial = new MeshPhongMaterial({color: 'white', wireframe: USE_WIREFRAME, side: DoubleSide});
let proofMaterial = new MeshPhongMaterial({color: 0xfff3e6, wireframe: USE_WIREFRAME, side: DoubleSide, shadowSide: 2});

const meshFloor = new Mesh (new CircleGeometry(50,40), rhinoMaterial);
scene.add(meshFloor);
meshFloor.receiveShadow = true;

// const sphereGeom = new SphereGeometry(5, 32, 16);
// const bola = new Mesh(sphereGeom, proofMaterial);
// scene.add(bola);
// bola.castShadow = true;

// 3DM Loading

const rhinoLoader = new Rhino3dmLoader();
rhinoLoader.setLibraryPath( 'node_modules/rhino3dm/' );
rhinoLoader.load(
  // '/loaders/Hinchable Kenzo Programa Variable.3dm',
  "loaders/Hinchable.3dm",
  function (object) {
      const childrenRhino = object.children;
      for (let child of childrenRhino) {
        console.log(child.type + " : " + child.material.name);
        if (child.type === 'Mesh') {
          child.castShadow = true;
          child.material.opacity = 0.7;
          child.material.polygonOffset = true;
          child.material.polygonOffsetFactor = 1; 
          child.material.polygonOffsetUnits = 1;
      }};
    console.log(object);
    scene.add(object);
  },
  function ( xhr ) {
    const text = document.getElementById('progress-text');
    const containerSpinner = document.getElementById('container-spinner');
    const percent = xhr.loaded / xhr.total * 100;
    const result = Math.trunc(percent);
    text.innerText = result.toString() + "%";
    if (result < 100) {containerSpinner.classList.remove('hiddenDelay');
  } else {containerSpinner.classList.add('hiddenDelay')};
		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
	},
	function ( error ) {	
		console.log( 'An error happened' );	
	}
);


//CREATE LIGHTS OF THE SCENE
const lightColor = 0xffffff;

const ambientLight = new AmbientLight(lightColor, 2);
scene.add(ambientLight);

const cameraFrustum = 50;

const directionalLight = new DirectionalLight(lightColor, 1);
directionalLight.position.set(50, 50, 50);
directionalLight.castShadow = true;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 500;
directionalLight.shadow.camera.top = cameraFrustum;
directionalLight.shadow.camera.bottom = - cameraFrustum;
directionalLight.shadow.camera.left = - cameraFrustum;
directionalLight.shadow.camera.right = cameraFrustum;
scene.add(directionalLight);


// const directionalLightHelper = new DirectionalLightHelper(directionalLight,5,'orange');
// scene.add(directionalLightHelper);

//Creates grids and axes in the scene
// const grid = new GridHelper(50, 30);
// scene.add(grid);

// const axes = new AxesHelper();
// axes.material.depthTest = false;
// axes.renderOrder = 1;
// scene.add(axes);

//Creates the orbit controls (to navigate the scene)
const controls = new OrbitControls(camera, threeCanvas);
controls.enableDamping = true;
controls.zoomToCursor = true;
controls.target.set(-2, 0, 0);

//Animation loop
const animate = () => {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};

animate();

//Adjust the viewport to the size of the browser
window.addEventListener("resize", () => {
  const windowX = window.innerWidth * marginRatio;

  if (threeCanvas.width !== windowX) {
    renderer.setSize(windowX, canvasRect.height);
    camera.aspect = windowX / canvasRect.height;
    camera.updateProjectionMatrix();
  }
  return;
});


// const material = new MeshBasicMaterial({
//   color: "orange",
// });

// 9 Debugging

// const gui = new GUI();
