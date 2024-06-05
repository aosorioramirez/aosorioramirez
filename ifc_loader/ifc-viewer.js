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
  PlaneHelper,
  Plane,
  Vector3,
  PCFShadowMap
} from "three";

// import { 
//   IFCBEAM,
//   IFCBUILDINGELEMENTPROXY,
//   IFCCOLUMN,
//   IFCCURTAINWALL,
//   IFCDOOR,
//   IFCELEMENTASSEMBLY,
//   IFCFLOWTERMINAL,
//   IFCFURNISHINGELEMENT,
//   IFCOPENINGELEMENT,
//   IFCPLATE,
//   IFCROOF,
//   IFCSLAB,
//   IFCSPACE,
//   IFCSTAIR,
//   IFCSTAIRFLIGHT,
//   IFCWALL,
//   IFCWALLSTANDARDCASE,
//   IFCWINDOW
// } from 'web-ifc';

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";

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
const camera = new PerspectiveCamera(50, canvasRect.width / canvasRect.height);
camera.position.z = 15;
camera.position.y = 13;
camera.position.x = 8;

//Creates the lights of the scene
const lightColor = "white";

const ambientLight = new AmbientLight(lightColor, 0.5);
scene.add(ambientLight);

const cameraFrustum = 50;

const directionalLight = new DirectionalLight(lightColor, 0.5);
directionalLight.position.set(10, 10, 5);
directionalLight.castShadow = true;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 500;
directionalLight.shadow.camera.top = cameraFrustum;
directionalLight.shadow.camera.bottom = -cameraFrustum;
directionalLight.shadow.camera.left = -cameraFrustum;
directionalLight.shadow.camera.right = cameraFrustum;
scene.add(directionalLight);

//Sets up the renderer, fetching the canvas of the HTML
const renderer = new WebGLRenderer({ canvas: threeCanvas, alpha: true });
renderer.setSize(canvasRect.width, canvasRect.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.localClippingEnabled = true;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = PCFShadowMap;
renderer.shadowMap.setSize = 2048;

let controlClipping = {z:0};
let clippingVector = new Vector3( 0, -1, 0);
let clippingPlane = new Plane(clippingVector);

const axes = new AxesHelper();
axes.material.depthTest = false;
axes.renderOrder = 1;
scene.add(axes);


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
let ifcModel;

// console.log(`./loaders/${currentProject.model}`);

let projectCategories = [];
let projectCategoriesKeys = [];
let projectCategoriesNo = [
  "IFCPROJECT",
  "IFCSPACE",
  "IFCBUILDINGSTOREY",
  // "IFCBUILDINGELEMENTPROXY",
  "IFCBUILDING"
];
let projectCategoriesSet = {};
let projectCategoriesNames = [];

async function loadIfc() {
  ifcModel = await ifcLoader.loadAsync(`./loaders/${currentProject.model}`);
  scene.add(ifcModel);
  ifcModel.castShadow = true;

  ifcModels.push(ifcModel);
  ifcModel.removeFromParent();

  await getAllModelCategories(ifcModel);

  // console.log(ifcModel);

  let projectCategoriesYes = projectCategoriesNames.filter(x=> !projectCategoriesNo.includes(x));

  createCheckbox(projectCategoriesYes);

  for (let i = 0; i < projectCategories.length; i++) {
    const catKey = ((Object.keys(projectCategories[i])[0]));
    projectCategoriesKeys.push(catKey); 
  }

  for (let i = 0; i < projectCategoriesYes.length; i++){
    const categoryName = projectCategoriesYes[i];
    const indexOfYes = projectCategoriesKeys.indexOf(categoryName);

    Object.assign(projectCategoriesSet, projectCategories[indexOfYes]);
  }

  await setupAllCategories();

  // MODEL BOUNDING BOX
  let minZ = Math.floor(ifcModel.geometry.boundingBox.min.y);
  let maxZ = Math.ceil(ifcModel.geometry.boundingBox.max.y);

  let allMaterials = ifcModel.material;
  let plSection = {add: false};

  // GUI  -----------------------------------------------------------
  let gui = new GUI(); 
  gui.domElement.id = 'gui'; 
  gui_container.appendChild(gui.domElement);
  gui.add(plSection, 'add').name('Sección');
  gui.add(controlClipping, 'z', minZ, maxZ, 0.01).name('Altura');

  let inputClipping = document.querySelector("label.widget input[type=checkbox]")

  inputClipping.addEventListener('click', () => {
    for (let mat of allMaterials) {
      if (plSection.add === false) {
        mat.clippingPlanes = [clippingPlane];
      } else {
        mat.clippingPlanes = null;
      }    
    }
  });
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


//CREATES THE ORBIT CONTROLS (TO NAVIGATE THE SCENE) -------------------
const controls = new OrbitControls(camera, threeCanvas);
controls.enableZoom = true;
controls.enableDamping = true;
controls.zoomToCursor = true;
controls.target.set(-2, 0, 0);

controls.update();


// GET THE NAME OF CATEGORIES ----------------------------------------
// PRUEBA ADRIAN 

async function getAllModelCategories(model) {
  const allElements = model.ifcManager.types.state.models[0].types;
  const allElementsEntries = Object.values(allElements);

  const typesMap = model.ifcManager.typesMap;

  const eachCategory = allElementsEntries.filter(onlyUnique);

  await relateTypes(typesMap, eachCategory);
}

function onlyUnique(value, index, array) {
  return array.indexOf(value) === index;
}

async function relateTypes (matrixRelate, categoryCodes) {
  const codes = Object.keys(matrixRelate);
  const names = Object.values(matrixRelate);

  const categString = categoryCodes.map(String);

  for (let categ of categString) {
    const index = codes.indexOf(categ);
    const categoryName = names[index];

    projectCategoriesNames.push(categoryName);

    const categoryObject = {
       [categoryName]: parseInt(categ)
    }

    projectCategories.push(categoryObject);
  }
}


// ----------------------------------------


// Gets the name of a category
function getName(category) {
	const names = Object.keys(projectCategoriesSet);
	return names.find(name => projectCategoriesSet[name] === category);
}


// Gets all the items of a category
async function getAll(category) {
  return ifcModel.ifcManager.getAllItemsOfType(ifcModel.modelID, category);
}


async function newSubsetOfType(category) {
  const ids = await getAll(category);
  return ifcModel.ifcManager.createSubset({
    modelID: ifcModel.modelID,
    scene,
    ids,
    removePrevious: true,
    customID: category.toString()
})
}

const subsets = {};


async function setupAllCategories(){
  const allCategories = Object.values(projectCategoriesSet);
  for (let i = 0; i < allCategories.length; i++){
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
})};


// ---------------------------------------------------------------


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
      const nameValue = props.ObjectType.value;
      console.log(props);
      console.log(nameValue);
      const psets = await ifcLoader.ifcManager.getPropertySets(
        found.object.modelID,
        id,
        true
      );
      // console.log(psets);
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

// window.onmousemove = (event) =>
//   highlight(event, preselectMat, preselectModel, false);
// window.onclick = (event) => highlight(event, selectMat, selectModel, true);


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

function createCheckbox(arrayOfNames) {
    for (let name of arrayOfNames) {
    const checkboxContainer = document.getElementById("checkboxContainer");
    const categoryBox = document.createElement('div');
    const categoryName = document.createElement('div');
    categoryBox.classList.add("checkbox");

    const categoryCheckbox = document.createElement('input');
    categoryCheckbox.type = "checkbox";
    categoryCheckbox.classList.add("input");
    categoryCheckbox.checked = true;
    categoryCheckbox.setAttribute('id', name);
    const nameClean = name.slice(3);
    categoryName.textContent = nameClean;
    categoryName.classList.add("checkboxText");

    checkboxContainer.appendChild(categoryBox);
    categoryBox.appendChild(categoryCheckbox);
    categoryBox.appendChild(categoryName);
  }
}


// BACK BUTTON -----------------------------------------------------------
const back = document.getElementById("backContainer");

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

back.onclick = function especialidadClick() {
  sleep(500).then(() => history.back());
}


//Animation loop
const animate = () => {
  controls.update();

  clippingPlane.constant = controlClipping.z;

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};

animate();



// AQUI FALTARÍA EL DISPOSE PARA LIMPIAR LA MEMORIA-----------------------

// IFC SPATIAL TREE -----------------------------------------------------

// function createTreMenu(ifcProject) {
//     const root = document.getElementById("tree-root");
//     removeAllChildren(root);
//     const ifcProjectNode = createNestedChild(root, ifcProject);
//     for(const child of ifcProject.children) {
//         constructTreeMenuNode(ifcProjectNode, child);
//     }
// }

// function constructTreeMenuNode(parent, node) {
//     const children = node.children;
//     if(children.length === 0) {
//         createSimpleChild(parent, node);
//         return;
//     }
//     const nodeElement = createNestedChild(parent, node);
//     for(const child of children) {
//         constructTreeMenuNode(nodeElement, child);
//     }
// }

// function createSimpleChild(parent, node) {
//     const content = nodeToString(node);
//     const childNode = document.createElement('li');
//     childNode.classList.add('leaf-node');
//     childNode.textContent = content;
//     parent.appendChild(childNode)
// }

// function createNestedChild(parent, node) {
//     const content = nodeToString(node);
//     const root = document.createElement('li');
//     createTitle(root, content);
//     const childrenContainer = document.createElement('ul');
//     childrenContainer.classList.add('nested');
//     root.appendChild(childrenContainer);
//     parent.appendChild(root);
//     return childrenContainer;
// }

// function createTitle(parent, content) {
//     const title = document.createElement('span');
//     title.classList.add('caret');
//     title.onclick = () => {
//         title.parentElement.querySelector('.nested').classList.toggle('active');
//         title.classList.toggle('caret-down');
//     }

//     title.textContent = content;
//     parent.appendChild(title);
// }

// function nodeToString(node) {
//     return `${node.type}`
//     // return `${node.type} - ${node.expressID}`
// }

// function removeAllChildren(element) {
//     while(element.firstChild) {
//         element.removeChild(element.firstChild);
//     }
// }

// const toggler = document.getElementsByClassName("caret");
// let i;

// for (i = 0; i < toggler.length; i++) {
//   toggler[i].addEventListener("click", function () {
//     this.parentElement.querySelector(".nested").classList.toggle("active");
//     this.classList.toggle("caret-down");
//   });
// }

