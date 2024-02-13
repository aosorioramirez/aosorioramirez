import {
    Scene,
    BoxGeometry,
    MeshBasicMaterial,
    Mesh,
    PerspectiveCamera,
    WebGLRenderer,
    MOUSE,
    Vector2,
    Vector3,
    Vector4,
    Quaternion,
    Matrix4,
    Spherical,
    Box3,
    Sphere,
    Raycaster,
    MathUtils,
    Clock,
    MeshLambertMaterial,
    DirectionalLight,
    TextureLoader,
    AmbientLight,
    AxesHelper,
    GridHelper,
    EdgesGeometry,
    LineSegments,
    Color
} from 'three';

import CameraControls from 'camera-controls';

import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { degToRad } from 'three/src/math/MathUtils';

// 1 The Scene

const scene = new Scene();
const canvas = document.getElementById('three-canvas');

const axes = new AxesHelper(0.2);
axes.material.depthTest = false;
axes.renderOrder = 2;
scene.add(axes);

const grid = new GridHelper( 2 , 10 , 'gray');
grid.material.depthTest = false;
grid.render = 1;
scene.add(grid);


// 2 The Geometry / Object

const loader = new GLTFLoader();


loader.load('./samurai_arena_building.glb',
(gltf) => {
    const model = gltf.scene;
    scene.add(model);
},

(progress) => {
    console.log(progress);
},

(error) => {
    console.log(error);
});

// 3 The Camera

const camera = new PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight);
camera.position.z = 3;
scene.add(camera);

// 4 The Renderer

const renderer = new WebGLRenderer({canvas:canvas});
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
renderer.setSize(canvas.clientWidth,canvas.clientHeight,false);
renderer.setClearColor('white');

// 5 Lights

const light = new DirectionalLight();
light.position.set(0.5,0.65,1).normalize();
scene.add(light);
const ambientLight = new AmbientLight('white', 3);
scene.add(ambientLight);

// 6 Responsivity

window.addEventListener('resize', () => {
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
});

// 7 Camera-Controls

const subsetOfTHREE = {
    MOUSE,
    Vector2,
    Vector3,
    Vector4,
    Quaternion,
    Matrix4,
    Spherical,
    Box3,
    Sphere,
    Raycaster,
    MathUtils: {
      DEG2RAD: MathUtils.DEG2RAD,
      clamp: MathUtils.clamp
    }
};

CameraControls.install( { THREE: subsetOfTHREE } );
const clock = new Clock();
const cameraControls = new CameraControls(camera, canvas);
cameraControls.dollyToCursor = true;

// 8 Animation

function animate() {
    const delta = clock.getDelta();
    cameraControls.update( delta );
    renderer.render( scene, camera );
    requestAnimationFrame(animate);
}
animate();

// 9 Debugging

const gui = new GUI();


const index = document.querySelector(".buttonIndex");

(window).scroll(function(){
    if($(this).scrollTop() > 200){
      $('.buttonIndex').css({'display': 'none'});
    }
});

//window.scroll(function ocultarIndice() {
//    if(index.scrollTop()>200){
//        index.style.display = "none";
//    }
//}

const nombresEspecialidades = [
    "ESPECIALISTA BIM",
    "REVIT",
    "GRASSHOPPER",
    "DYNAMO"
]

const nombresProyectos = [
    {'name': "CASA REFUGIO",'number': "1"},
    {'name': "TFM ESTRUCTURAS",'number': "2"},
    {'name': "LÁMPARA FUENTE",'number': "3"},
    {'name': "MESA FLOTANTE",'number': "4"},
    {'name': "MACETERO CEMENTO HECHA DE PUTA MADRE",'number': "5"}
]

const simboloCruz = (Array(nombresEspecialidades.length).fill("🐻"));
//🖕

function showSlides(){
    let i;
    let slides = document.getElementsByClassName("image");
    let dots = document.getElementsByClassName("dot");
    

    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }

    slideIndex++;
    if (slideIndex > slides.length) {slideIndex = 1};

    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }

    slides[slideIndex-1].style.display = "block";
    dots[slideIndex-1].className += " active";
    setTimeout(showSlides, 4000); //Change image every 2 seconds
}

let slideIndex = 0;
showSlides();

const cartas = document.querySelector(".containerCartas");

for (const nombre of nombresEspecialidades) {
    const text = document.createElement("h3");

    text.classList.add("cadaCarta");
    
    text.onclick = function (){
        location.href = "indexcarta.html";  
    }

    text.textContent = nombre;
    cartas.appendChild(text);
}

const cruces = document.querySelector(".containerOsitos");    
for (const cruz of simboloCruz){
    const text = document.createElement("h3");

    text.classList.add("cadaOsito");

    text.onclick = function (){
        location.href = "indexcarta"+ simboloCruz.index+".html";  
    }

    text.textContent = cruz;
    cruces.appendChild(text);
}

const proyectos = document.querySelector(".containerProyecto");
for (const proyecto of nombresProyectos){
   const text = document.createElement("h3");
   
   text.classList.add("cadaProyecto");

   text.textContent = proyecto.name;
   proyectos.appendChild(text);
}






