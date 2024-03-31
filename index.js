import { nombresProyectos, nombresEspecialidades } from "./info.js";

//INDEX ----------------------------------------------------------------------------------

const index = document.getElementById("indexContainer");

window.onscroll = function () {
  var currentScrollY = window.scrollY;
  if (currentScrollY > 500) {
    index.classList.add("hidden");
  } else {
    index.classList.remove("hidden");
  }
};

//SHOW SLIDES ----------------------------------------------------------------------------

let slides = document.getElementsByClassName("mySlides");
let arraySlides = Array.from(slides);
const containerDot = document.querySelector("#dotContainer");

// CREATE DOTS
for (const slide of arraySlides) {
    const text = document.createElement("span");
    text.classList.add("dot");  
    containerDot.appendChild(text);
}

let slideIndex = 1;
showSlides(slideIndex);

document.getElementById("prev").addEventListener("click", plusSlides);
function plusSlides() {showSlides(slideIndex += -1)};

document.getElementById("next").addEventListener("click", minusSlides);
function minusSlides() {showSlides(slideIndex += 1)};

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

//   slideIndex++;
//   setTimeout(showSlides, 3000);
}

let dots = document.getElementsByClassName("dot");
const dotArray = Array.from(dots);

for (const dot of dotArray) {
    const dotNumber = dotArray.indexOf(dot)+1;
    dot.onclick = function () {
        showSlides(slideIndex = dotNumber);
    }
}

// function showSlides(){
//     let i;
//     let slides = document.getElementsByClassName("image");
//     let dots = document.getElementsByClassName("dot");

//     for (i = 0; i < slides.length; i++) {
//         slides[i].style.display = "none";
//     }

//     slideIndex++;
//     if (slideIndex > slides.length) {slideIndex = 1};

//     for (i = 0; i < dots.length; i++) {
//         dots[i].className = dots[i].className.replace(" active", "");
//     }

//     slides[slideIndex-1].style.display = "block";
//     dots[slideIndex-1].className += " active";
//     setTimeout(showSlides, 4000); //Change image every 2 seconds
// }

// ESPECIALIDADES / SECCIONES ------------------------------------------------------------

const simboloCruz = Array(nombresEspecialidades.length).fill("🐻");

const cartas = document.querySelector(".containerCartas");

for (const nombre of nombresEspecialidades) {
  const text = document.createElement("h3");

  text.classList.add("cadaCarta");

  text.onclick = function () {
    location.href = "indexcarta.html";
  };

  text.textContent = nombre;
  cartas.appendChild(text);
}

const cruces = document.querySelector(".containerOsitos");

for (const cruz of simboloCruz) {
  const text = document.createElement("h3");

  text.classList.add("cadaOsito");

  text.onclick = function () {
    location.href = "indexcarta" + simboloCruz.index + ".html";
  };

  text.textContent = cruz;
  cruces.appendChild(text);
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
    location.href = `${proyecto.loader}.html`;
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
