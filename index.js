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
    TextureLoader
} from 'three';

import CameraControls from 'camera-controls';

// 1 The Scene

const scene = new Scene();
const canvas = document.getElementById('three-canvas');

// 2 The Geometry

const loader = new TextureLoader();

const geometry = new BoxGeometry(0.5,0.5,0.5);
const greenMaterial = new MeshBasicMaterial({color:'green'});
const yellowMaterial = new MeshLambertMaterial ({
    color: 0xffffff,
    map: loader.load('./sample.png')
});

const greenCube = new Mesh(geometry,greenMaterial);
scene.add(greenCube);

const yellowCube = new Mesh(geometry, yellowMaterial);
yellowCube.position.x += 1;
yellowCube.scale.set(0.75,0.75,0.75);
scene.add(yellowCube);

// 3 The Camera

const camera = new PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight);
camera.position.z = 3;
scene.add(camera);

// 4 The Renderer

const renderer = new WebGLRenderer({canvas:canvas});
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
renderer.setSize(canvas.clientWidth,canvas.clientHeight,false);

// 5 Lights

const light = new DirectionalLight();
light.position.set(0.5,0.65,1).normalize();
scene.add(light);

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






