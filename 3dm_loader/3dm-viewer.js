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
renderer.shadowMap.type = PCFShadowMap;
renderer.shadowMap.setSize = 2048;

//Creates the camera (point of view of the user)
const camera = new PerspectiveCamera(50, canvasRect.width / canvasRect.height);
camera.position.x = -20;
camera.position.y = -40;
camera.position.z = 20;

// BASE

let rhinoMaterial = new MeshPhongMaterial({
  color: "white",
  transparent: true,
  opacity: 0.5,
  wireframe: USE_WIREFRAME,
  side: 2,
});
let proofMaterial = new MeshPhongMaterial({
  color: 0xfff3e6,
  wireframe: USE_WIREFRAME,
  side: DoubleSide,
  shadowSide: 2,
});

const meshFloor = new Mesh(new CircleGeometry(50, 40), rhinoMaterial);
scene.add(meshFloor);
meshFloor.receiveShadow = true;

// const sphereGeom = new SphereGeometry(5, 32, 16);
// const bola = new Mesh(sphereGeom, proofMaterial);
// scene.add(bola);
// bola.castShadow = true;


// 3DM LOADING -------------------------------------------------------
const rhinoModels = [];

const rhinoLoader = new Rhino3dmLoader();
rhinoLoader.setLibraryPath("node_modules/rhino3dm/");

let childrenRhino;

rhinoLoader.load(
  `./loaders/${currentProject.model}`,
  async function (object) {
    childrenRhino = object.children;
    for (let child of childrenRhino) {
      getAllSpheres(child);

      if (child.type === "Mesh") {
        child.castShadow = true;
        child.material.opacity = 0.9;
        child.material.polygonOffset = true;
        child.material.polygonOffsetFactor = 1;
        child.material.polygonOffsetUnits = 1;
        child.material.depthTest = false;
        child.material.depthWrite = false;
      }
    }
    rhinoModels.push(object);
    scene.add(object);

    const materials = new Set([]);
    scene.traverse( function (object) {
      if (object.material) materials.add(object.material);
    });
    const materialsSet = Array.from(materials);

    // console.log(materialsSet[4]);

    for (let mat of materialsSet) {
      if (mat.name === "TELA TRANSPARENTE") {
        const gui = new GUI({autoPlace: false});
        gui.domElement.id = 'gui';
        gui_container.appendChild(gui.domElement);
        gui.add(mat, 'opacity', 0, 1, 0.1).name('Transparencia Malla');
        if (mat.opacity === 1){
          mat.depthTest = true;
        }
      };
    };

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


// 3D LABELS -------------------------------------------------------
async function getAllSpheres(child) {
  if (child.type === "Mesh" && child.material.name === "REACCIONES") {
    
    let centerPoints = [];
    let centerInfos = [];
    
    const childGeom = child.geometry;
    const childInfo = child.name;
    const centerPoint = new Vector3();

    childGeom.computeBoundingBox();

    centerPoint.x = (childGeom.boundingBox.max.x + childGeom.boundingBox.min.x) / 2;
    centerPoint.y = (childGeom.boundingBox.max.y + childGeom.boundingBox.min.y) / 2;
    centerPoint.z = (childGeom.boundingBox.max.z + childGeom.boundingBox.min.z) / 2;

    child.localToWorld(centerPoint);
    centerPoints.push(centerPoint);
    centerInfos.push(childInfo);
  
    await createLabels(centerPoints, centerInfos);
  }
}

let infoArray = [];
async function createLabels(centerPoints, centerInfo) {

  centerPoints.forEach(point => {
    const baseHtml = document.createElement("div");
    baseHtml.className = "base-label";
    
    const labelHtml = document.createElement("div");
    labelHtml.className = "label";
    const index = centerPoints.indexOf(point);
    infoArray.push(index);
    // let lastItem = infoArray[infoArray.length-1];
    // console.log(infoArray);


    labelHtml.textContent = centerInfo[index] + " KN";
    baseHtml.appendChild(labelHtml);
    
    const label3D = new CSS2DObject(baseHtml);
    label3D.position.set( point.getComponent(0) , point.getComponent(1) , point.getComponent(2) );
    scene.add(label3D);
 });
}



const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(canvasRect.width, canvasRect.height);
labelRenderer.domElement.style.position = "fixed";
labelRenderer.domElement.style.pointerEvents = "none";
labelRenderer.domElement.style.top = "0";
document.body.appendChild(labelRenderer.domElement);


//CREATE LIGHTS OF THE SCENE ------------------------------------------
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
directionalLight.shadow.camera.bottom = -cameraFrustum;
directionalLight.shadow.camera.left = -cameraFrustum;
directionalLight.shadow.camera.right = cameraFrustum;
scene.add(directionalLight);



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

// 9 Debugging
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


const raycaster = new Raycaster();
raycaster.firstHitOnly = true;
const mouse = new Vector2();

let intersects;

function cast(event) {
  const bounds = threeCanvas.getBoundingClientRect();

  const x1 = event.clientX - bounds.left;
  const x2 = bounds.right - bounds.left;
  mouse.x = (x1 / x2) * 2 - 1;

  const y1 = event.clientY - bounds.top;
  const y2 = bounds.bottom - bounds.top;
  mouse.y = -(y1 / y2) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  intersects = raycaster.intersectObjects(rhinoModels);
  return intersects;
}

//

window.addEventListener("click", (event) => {
  const bounds = threeCanvas.getBoundingClientRect();

  const x1 = event.clientX - bounds.left;
  const x2 = bounds.right - bounds.left;
  mouse.x = (x1 / x2) * 2 - 1;

  const y1 = event.clientY - bounds.top;
  const y2 = bounds.bottom - bounds.top;
  mouse.y = -(y1 / y2) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  intersects = raycaster.intersectObjects(rhinoModels);
});

//

const preselectMat = new MeshLambertMaterial({
  transparent: true,
  opacity: 0.6,
  color: 0xccccff,
  depthTest: false,
});

const selectMat = new MeshLambertMaterial({
  transparent: true,
  opacity: 0.6,
  color: 0xffdd00,
  depthTest: false,
});

let objectsStore = [];
let materialsStore = [];

function highlight(event, material) {
  const found = cast(event)[0];

  if (found) {
    const foundObject = found.object;
    const foundMaterial = found.object.material;

    // console.log(foundObject);

    objectsStore.push(foundObject);
    materialsStore.push(foundMaterial);

    foundObject.material = material;

    if (objectsStore.length > 2) {
      objectsStore.splice(0, 1);
      materialsStore.splice(0, 1);
    }

    if (objectsStore.length > 1) {
      const previousObject = objectsStore[objectsStore.length - 2];
      const previousMaterial = materialsStore[materialsStore.length - 2];

      if (foundObject.uuid != objectsStore[objectsStore.length - 2].uuid) {
        previousObject.material = previousMaterial;
      }

      if (foundMaterial === material) {
        restorePreviousMat(materialsStore[materialsStore.length - 2]);
      }
    }
  } else {
    objectsStore[objectsStore.length - 1].material =
      materialsStore[materialsStore.length - 1];
  }
}

function restorePreviousMat(mat) {
  materialsStore.pop();
  materialsStore.push(mat);
}

// window.onmousemove = (event) => highlight(event, preselectMat);
window.onclick = (event) => highlight(event, selectMat);


// BACK BUTTON -----------------------------------------------------------
const back = document.getElementById("backContainer");

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

back.onclick = function especialidadClick() {
  sleep(500).then(() => history.back());
}

// AQUI FALTARÍA EL DISPOSE PARA LIMPIAR LA MEMORIA-----------------------