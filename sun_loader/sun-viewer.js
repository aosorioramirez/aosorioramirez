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
  Vector3,
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
  LineBasicMaterial,
} from "three";

import {
  CSS2DRenderer,
  CSS2DObject,
} from "three/examples/jsm/renderers/CSS2DRenderer.js";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import { Rhino3dmLoader } from "three/examples/jsm/loaders/3DMLoader.js";

import { nombresProyectos, nombresEspecialidades } from "../info.js";

import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";

const currentProjectNumber = localStorage.getItem("projectNumber");
const currentProject = nombresProyectos[currentProjectNumber-1];

const nombreProyecto = document.getElementById("nombreProyecto");
nombreProyecto.textContent = `${currentProject.name}`;


let USE_WIREFRAME = false;

//Creates the Three.js scene
Object3D.DEFAULT_UP.set(0, 0, 1);
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
renderer.shadowMap.type = PCFSoftShadowMap;
renderer.shadowMap.setSize = 2048;

//Creates the camera (point of view of the user)
const camera = new PerspectiveCamera(50, canvasRect.width / canvasRect.height);
camera.position.x = 0;
camera.position.y = -80;
camera.position.z = 20;

// BASE

let rhinoMaterial = new MeshPhongMaterial({
  color: 0xE8F3DD,
  transparent: false,
  opacity: 1,
  wireframe: USE_WIREFRAME,
  side: 2,
});
let proofMaterial = new MeshPhongMaterial({
  color: 0xfff3e6,
  wireframe: USE_WIREFRAME,
  side: DoubleSide,
  shadowSide: 2,
});
let sunMaterial = new MeshPhongMaterial({
  color: 0xf8e673,
  wireframe: USE_WIREFRAME,
  side: DoubleSide,
});

const meshFloor = new Mesh(new CircleGeometry(200, 40), rhinoMaterial);
scene.add(meshFloor);
meshFloor.receiveShadow = true;


// 3DM LOADING -------------------------------------------------------
const rhinoModels = [];

const rhinoLoader = new Rhino3dmLoader();
rhinoLoader.setLibraryPath("node_modules/rhino3dm/");

let childrenRhino;
let arraySunPoints = [];
let arraySunPointsFilled =[];

rhinoLoader.load(
  `./loaders/${currentProject.model}`,
  async function (object) {
    childrenRhino = object.children;

    for (let child of childrenRhino) {
      
      getAllPoints(child);

      if (child.type === "Mesh" ) {
        child.castShadow = true;
        // child.material.color = 0x2255ff;
        // child.material.opacity = 1;
        // child.material.depthTest = true;
        // child.material.depthWrite = true;
        // child.material.emissive = 0xffaa22;
      }
    };

    rhinoModels.push(object);
    scene.add(object);

    function sleep(ms) {return new Promise(resolve => setTimeout(resolve, ms))};
    function waitForConsoleArray() {
      sleep(2000).then(function() {
        arraySunPointsFilled = arraySunPoints;
        // console.log(arraySunPointsFilled);
    })};

    waitForConsoleArray();

    console.log(object);
  },

  function (xhr) {
    const text = document.getElementById("progress-text");
    const containerSpinner = document.getElementById("container-spinner");
    const percent = (xhr.loaded / xhr.total) * 100;
    const result = Math.trunc(percent);
    text.innerText = result.toString() + "%";
    if (result < 100) {
      containerSpinner.classList.remove("hidden");
    } else {
      containerSpinner.classList.add("hidden");
    }
    // console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
  },

  function (error) {
    console.log("An error happened");
  }
);

// console.log(arraySunPoints);



// 3D LABELS -------------------------------------------------------

function getAllPoints(child) {
  if (child.type === "Points") {
    
    child['visible'] = false;
    const childGeom = child.geometry;
    childGeom.computeBoundingSphere();
    const centerPoint = new Vector3();

    const childName = child.name;
    const pointMes = child.userData.attributes.userStrings[0][1];
    const pointDia = child.userData.attributes.userStrings[1][1];
    const pointHora = child.userData.attributes.userStrings[2][1];    

    childGeom.computeBoundingBox();

    centerPoint.x = (childGeom.boundingSphere.center.x);
    centerPoint.y = (childGeom.boundingSphere.center.y);
    centerPoint.z = (childGeom.boundingSphere.center.z);

    child.localToWorld(centerPoint);

    let sunPoint = {};
    Object.defineProperty(sunPoint, 'punto', {value: centerPoint});
    Object.defineProperty(sunPoint, 'name', {value: childName});
    Object.defineProperty(sunPoint, 'mes', {value: pointMes});
    Object.defineProperty(sunPoint, 'dia', {value: pointDia});
    Object.defineProperty(sunPoint, 'hora', {value: pointHora});

    arraySunPoints.push(sunPoint);
  }
}


const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(canvasRect.width, canvasRect.height);
labelRenderer.domElement.style.position = "fixed";
labelRenderer.domElement.style.pointerEvents = "none";
labelRenderer.domElement.style.top = "0";
document.body.appendChild(labelRenderer.domElement);



// GUI  -----------------------------------------------------------

const currentTime = new Date();
const month = currentTime.getMonth()+1;
const day = currentTime.getDate();
const hour = currentTime.getHours();

let puntoSolar = {mes: month, dia: day, hora: hour}
const gui = new GUI({autoPlace: false}); 
gui.domElement.id = 'gui'; 
gui_container.appendChild(gui.domElement);

gui.add(puntoSolar, 'mes', 1, 12, 1).name('MES');
gui.add(puntoSolar, 'dia', 1, 31, 1).name('DIA');
gui.add(puntoSolar, 'hora', 8, 21, 1).name('HORA');

//CREATE LIGHTS OF THE SCENE ------------------------------------------
const ambientLightColor = 0xffffff;
const lightColor = 0xffffff;

const ambientLight = new AmbientLight(ambientLightColor, 1);
scene.add(ambientLight);

const cameraFrustum = 50;

const directionalLight = new DirectionalLight(lightColor, 1);
directionalLight.position.set(0, 0, -10);
directionalLight.castShadow = true;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 500;
directionalLight.shadow.camera.top = cameraFrustum;
directionalLight.shadow.camera.bottom = -cameraFrustum;
directionalLight.shadow.camera.left = -cameraFrustum;
directionalLight.shadow.camera.right = cameraFrustum;

scene.add(directionalLight);

let arraySunPointsFilledName = [];
let puntoSolarName;
let foundIndex;

let sunX;
let sunY;
let sunZ;

const sphereGeom = new SphereGeometry(5, 30, 30);
const sol = new Mesh(sphereGeom, sunMaterial);

function sleepMore(ms) {return new Promise(resolve => setTimeout(resolve, ms))};
function waitForConsoleNames() {
  sleepMore(8000).then(function() {
    for (let item of arraySunPointsFilled) {
      let name = item.name;
      arraySunPointsFilledName.push(name);
    }
  // console.log(arraySunPointsFilledName);

  function lightPuntoSolar() {
    puntoSolarName = puntoSolar.mes+"_"+puntoSolar.dia+"_"+puntoSolar.hora;
    setTimeout(lightPuntoSolar, 100);
    
    let lookForSunPoint = arraySunPointsFilledName.find((element) => element === puntoSolarName);
    foundIndex = arraySunPointsFilledName.indexOf(lookForSunPoint);

    if (foundIndex >= 0) {
      directionalLight.intensity = 1;
      sunX = arraySunPointsFilled[foundIndex]['punto']['x'];
      sunY = arraySunPointsFilled[foundIndex]['punto']['y'];
      sunZ = arraySunPointsFilled[foundIndex]['punto']['z'];
  
      directionalLight.position.set(sunX, sunY, sunZ);
      sol.position.set(sunX, sunY, sunZ);

    } else {
      directionalLight.intensity = 0.01;
      ambientLight.intensity = 0.2;
      directionalLight.position.set(0, 0, 0);
      sol.position.set(0, 0, -10);
    };

    // console.log(directionalLight.intensity);
  }

  lightPuntoSolar();
  })
};

waitForConsoleNames();

scene.add(sol);





// DESPLEGABLE ----------------------------------------------
var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  });
}


//CREATES THE ORBIT CONTROLS (TO NAVIGATE THE SCENE) -------------------
const controls = new OrbitControls(camera, threeCanvas);
controls.enableDamping = true;
controls.zoomToCursor = true;
controls.target.set(-2, 0, 0);

//ANIMATION LOOP -------------------------------------------------------
const animate = () => {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
  labelRenderer.render(scene, camera);
};

animate();

//ADJUST THE VIEWPORT TO THE SIZE OF THE BROWSER------------------------
window.addEventListener("resize", () => {
  const windowX = window.innerWidth * marginRatio;

  if (threeCanvas.width !== windowX) {
    renderer.setSize(windowX, canvasRect.height);
    camera.aspect = windowX / canvasRect.height;
    camera.updateProjectionMatrix();
    labelRenderer.setSize(threeCanvas.clientWidth, threeCanvas.clientHeight);
  }
  return;
});

// const material = new MeshBasicMaterial({
//   color: "orange",
// });



// BACK BUTTON -----------------------------------------------------------
const back = document.getElementById("backContainer");

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

back.onclick = function especialidadClick() {
  sleep(500).then(() => history.back());
}

const aor = document.getElementById("logo");
aor.addEventListener('click', function() { 
  sleep(100).then(() => window.history.go(-1));
});

// AQUI FALTARÍA EL DISPOSE PARA LIMPIAR LA MEMORIA-----------------------