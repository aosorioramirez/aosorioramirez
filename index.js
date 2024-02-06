import {
    Scene,
    BoxGeometry,
    MeshBasicMaterial,
    Mesh,
    PerspectiveCamera,
    WebGLRenderer
} from 'three';
//1 The Scene
const scene = new Scene();
//2 The Geometry
const geometry = new BoxGeometry(0.5,0.5,0.5);
const material = new MeshBasicMaterial({color:'orange'});
const mesh =new Mesh(geometry,material);
scene.add(mesh);
//3 The Camera
const sizes = {
    width: 800,
    height: 600
}
const camera = new PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);
//4 The Renderer
const canvas = document.getElementById('three-canvas');
const renderer = new WebGLRenderer({canvas:canvas});
renderer.setSize(sizes.width,sizes.height);
renderer.render(scene,camera);

function animationCube() {
    mesh.rotation.x += 0.01;
    mesh.rotation.z += 0.01;
    renderer.render(scene,camera);
    requestAnimationFrame(animationCube);
}
animationCube();


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






