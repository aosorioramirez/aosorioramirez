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
    {'name': "MACETERO CEMENTO",'number': "5"}
]


const simboloCruz = (Array(nombresEspecialidades.length).fill("🐻"));

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
   
    //Crea una nueva carta y le pone el class
    const text = document.createElement("h3");
    text.classList.add("cadaProyecto");

    //Pone el nombre del proyecto
    text.textContent = proyecto.name;
    proyectos.appendChild(text);

    
    text.onclick = function (){
        location.href = "loader.html";
    };
    text.addEventListener("click", function(){
        text.classList.add("currentProject");
    });

    text.removeEventListener("click", function(){
        text.classList.add("currentProject");
    });
}