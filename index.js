import { nombresProyectos, nombresEspecialidades } from "./info.js";

//INDEX ----------------------------------------------------------------------------------

// const index = document.getElementById("indexContainer");

// window.onscroll = function () {
//   var currentScrollY = window.scrollY;
//   if (currentScrollY > 500) {
//     index.classList.add("hidden");
//   } else {
//     index.classList.remove("hidden");
//   }
// };

//SLIDES ----------------------------------------------------------------------------

let slides = document.getElementsByClassName("mySlides");
let arraySlides = Array.from(slides);
const containerDot = document.querySelector("#dotContainer");

// CREATE DOTS
for (const slide of arraySlides) {
    const text = document.createElement("span");
    text.classList.add("dot");  
    containerDot.appendChild(text);
}

// SLIDES FLOW
let slideIndex = 0;
showSlides(slideIndex);

const next = document.getElementById("next");
const prev = document.getElementById("prev");

prev.addEventListener("click", minusSlides);
function minusSlides() {showSlides(slideIndex += -1)};

next.addEventListener("click", plusSlides);
function plusSlides() {showSlides(slideIndex += 1)};

// AUTO SLIDES FLOW
function clickNext(){
  next.click();
  setTimeout(clickNext, 5000);
}; clickNext();


function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");

  if (n > slides.length) {
    slideIndex = 1;
  }
  if (n < 1) {
    slideIndex = slides.length;
  }

  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }

  slides[slideIndex - 1].style.display = "block";
  dots[slideIndex - 1].className += " active";
}

let dots = document.getElementsByClassName("dot");
const dotArray = Array.from(dots);

for (const dot of dotArray) {
    const dotNumber = dotArray.indexOf(dot)+1;
    dot.onclick = function () {
        showSlides(slideIndex = dotNumber);
    }
}

// ESPECIALIDADES / SECCIONES ------------------------------------------------------------
const especialidad = document.querySelector(".especialidades");

for (const nombre of nombresEspecialidades) {
  const container = document.createElement("h3");
  const textSimbol = document.createElement("h3");
  const text = document.createElement("h3");

  container.classList.add("especialidadContainer");
  textSimbol.classList.add("especialidadSimbolo");
  text.classList.add("especialidadTexto");
  container.classList.add(`container${nombre.side}`);
  text.classList.add(nombre.side);
  textSimbol.classList.add(nombre.side);

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  text.onclick = function especialidadClick() {
    // sleep(500).then(() => location.href = nombre.url);
    sleep(300).then(() => location.href = nombre.url);
    console.log(nombre.url);
  }



  text.textContent = nombre.name;
  textSimbol.textContent = nombre.icon;

  especialidad.appendChild(container);
  container.appendChild(textSimbol);
  container.appendChild(text);
}

// PROJECT CARDS -------------------------------------------------------------------------

const proyectos = document.querySelector(".containerProyecto");

for (const proyecto of nombresProyectos) {
  //Crea una nueva carta y le pone el class
  const text = document.createElement("h3");
  text.classList.add("cadaProyecto");

  //Pone el nombre del proyecto
  text.textContent = proyecto.name;
  proyectos.appendChild(text);

  text.onclick = function () {
    location.href = `${proyecto.loader}`;
    const currentProjectNumber = proyecto.number;
    localStorage.setItem("projectNumber", currentProjectNumber);
  };
  text.addEventListener("click", function () {
    text.classList.add("currentProject");
  });

  text.removeEventListener("click", function () {
    text.classList.add("currentProject");
  });
}

// --------------------------------------------------------------------------------------
