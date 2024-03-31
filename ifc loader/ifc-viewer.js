//import { nombresProyectos } from "index.js";
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
  Vector2,
} from "three";

import {
  IFCWALLSTANDARDCASE,
  IFCSLAB,
  IFCFURNISHINGELEMENT,
  IFCDOOR,
  IFCWINDOW,
  IFCPLATE,
  IFCMEMBER
} from 'web-ifc';

const categories = {
  IFCWALLSTANDARDCASE,
  IFCSLAB,
  IFCFURNISHINGELEMENT,
  IFCDOOR,
  IFCWINDOW,
  IFCPLATE,
  IFCMEMBER
}

// import * as THREE from 'three';

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import { IFCLoader } from "web-ifc-three/IFCLoader.js";

import {
  computeBoundsTree,
  disposeBoundsTree,
  acceleratedRaycast,
} from "three-mesh-bvh";

import { MeshLambertMaterial } from "three";

import { nombresProyectos, nombresEspecialidades } from "../info.js";


const currentProjectNumber = localStorage.getItem("projectNumber");
const currentProject = nombresProyectos[currentProjectNumber-1];

const nombreProyecto = document.getElementById("nombreProyecto");
console.log(nombreProyecto);
nombreProyecto.textContent = `${currentProject.name}`;

//Creates the Three.js scene
const scene = new Scene();

//Object to store the size of the viewport
const threeCanvas = document.getElementById("three-canvas");
const canvasRect = {
  width: threeCanvas.offsetWidth,
  height: threeCanvas.offsetHeight,
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
const lightColor = "white";

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

// IFC Loading

const ifcLoader = new IFCLoader();


async function setUpMultiThreading() {
  const manager = ifcLoader.ifcManager;
  await manager.useWebWorkers(true, './IFCWorker.js');
}

ifcLoader.ifcManager.setupThreeMeshBVH(
  computeBoundsTree,
  disposeBoundsTree,
  acceleratedRaycast
);

ifcLoader.ifcManager.applyWebIfcConfig({ COORDINATE_TO_ORIGIN: true });

const ifcModels = [];
let autoModel;

// console.log(`./loaders/${currentProject.model}`);

async function loadIfc() {
  autoModel = await ifcLoader.loadAsync(`./loaders/${currentProject.model}`);
  scene.add(autoModel);
  ifcModels.push(autoModel);
  autoModel.removeFromParent();
  
  const project = await autoModel.ifcManager.getSpatialStructure(autoModel.modelID);
  console.log(project);
  createTreMenu(project);
  await setupAllCategories();
}


async function readWasm(){
  await ifcLoader.ifcManager.setWasmPath("./web help/");
}

function setupProgressNotification() {
  const text = document.getElementById('progress-text');
  const containerSpinner = document.getElementById('container-spinner');
  ifcLoader.ifcManager.setOnProgress((event) => {
    const percent = event.loaded / event.total * 100;
    const result = Math.trunc(percent);
    text.innerText = result.toString() + "%";
    if (result < 100) {containerSpinner.classList.remove('hidden');
    } else {containerSpinner.classList.add('hidden')};
  });
}


loadIfc();
readWasm();
setUpMultiThreading();
setupProgressNotification();



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
  mouse.y = -(y1 / y2) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  return raycaster.intersectObjects(ifcModels);
}

const preselectMat = new MeshLambertMaterial({
  transparent: true,
  opacity: 0.6,
  color: 0xccccff,
  depthTest: false,
});

let preselectModel = { id: -1 };

const selectMat = new MeshLambertMaterial({
  transparent: true,
  opacity: 0.6,
  color: 0xffdd00,
  depthTest: false,
});

const selectModel = { id: -1 };

async function highlight(event, material, model, getProps) {
  const found = cast(event)[0];
  if (found) {
    // Gets model ID
    model.id = found.object.modelID;

    // Gets Express ID
    const index = found.faceIndex;
    const geometry = found.object.geometry;
    const id = ifcLoader.ifcManager.getExpressId(geometry, index);

    if (getProps) {
      const props = await ifcLoader.ifcManager.getItemProperties(
        found.object.modelID,
        id
      );
      console.log(props);
      const psets = await ifcLoader.ifcManager.getPropertySets(
        found.object.modelID,
        id,
        true
      );
      console.log(psets);
    }

    // Creates Subset
    ifcLoader.ifcManager.createSubset({
      modelID: model.id,
      ids: [id],
      material: material,
      scene: scene,
      removePrevious: true,
    });
  } else {
    // Removes previous highlight
    ifcLoader.ifcManager.removeSubset(model.id, material);
  }
}

window.onmousemove = (event) =>
  highlight(event, preselectMat, preselectModel, false);
window.onclick = (event) => highlight(event, selectMat, selectModel, true);

// 9 Debugging

// const gui = new GUI();

// IFC SPATIAL TREE

function createTreMenu(ifcProject) {
    const root = document.getElementById("tree-root");
    removeAllChildren(root);
    const ifcProjectNode = createNestedChild(root, ifcProject);
    for(const child of ifcProject.children) {
        constructTreeMenuNode(ifcProjectNode, child);
    }
}

function constructTreeMenuNode(parent, node) {
    const children = node.children;
    if(children.length === 0) {
        createSimpleChild(parent, node);
        return;
    }
    const nodeElement = createNestedChild(parent, node);
    for(const child of children) {
        constructTreeMenuNode(nodeElement, child);
    }
}

function createSimpleChild(parent, node) {
    const content = nodeToString(node);
    const childNode = document.createElement('li');
    childNode.classList.add('leaf-node');
    childNode.textContent = content;
    parent.appendChild(childNode)
}

function createNestedChild(parent, node) {
    const content = nodeToString(node);
    const root = document.createElement('li');
    createTitle(root, content);
    const childrenContainer = document.createElement('ul');
    childrenContainer.classList.add('nested');
    root.appendChild(childrenContainer);
    parent.appendChild(root);
    return childrenContainer;
}

function createTitle(parent, content) {
    const title = document.createElement('span');
    title.classList.add('caret');
    title.onclick = () => {
        title.parentElement.querySelector('.nested').classList.toggle('active');
        title.classList.toggle('caret-down');
    }

    title.textContent = content;
    parent.appendChild(title);
}

function nodeToString(node) {
    return `${node.type} - ${node.expressID}`
}

function removeAllChildren(element) {
    while(element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

const toggler = document.getElementsByClassName("caret");
let i;

for (i = 0; i < toggler.length; i++) {
  toggler[i].addEventListener("click", function () {
    this.parentElement.querySelector(".nested").classList.toggle("active");
    this.classList.toggle("caret-down");
  });
}


function getName(category) {
  const names = Object.keys(categories);
  return names.find(name => categories[name] === category)
}

async function getAll(category) {
  return autoModel.ifcManager.getAllItemsOfType(autoModel.modelID, category);
}

async function newSubsetOfType(category) {
  const ids = await getAll(category);
  return autoModel.ifcManager.createSubset({
    modelID: autoModel.modelID,
    scene,
    ids,
    removePrevious: true,
    customID: category.toString()
})
}

const subsets = {};

async function setupAllCategories(){
  const allCategories = Object.values(categories);
  for (let i=0; i < allCategories.length; i++){
    const category = allCategories[i];
    await setupCategory(category);
  }
}

async function setupCategory(category) {
  subsets[category] = await newSubsetOfType(category);
  setupCheckBox(category);
}

function setupCheckBox(category) {
  const name = getName(category);
  const checkBox = document.getElementById(name);
  checkBox.addEventListener('change', (event) => {
    const checked = event.target.checked;
    const subset = subsets[category];
    if (checked) scene.add(subset);
    else subset.removeFromParent();
  });
}

