// function getPics() {} //just for this demo
const imgs = document.querySelectorAll('img');
const fullPage = document.getElementById('fullpage');
const imgFullPage = document.getElementById('imageFullPage');

imgs.forEach(img => {
  img.addEventListener('click', function() {

    document.body.classList.add("stop-scrolling");

    let innerH = window.innerHeight;
    let innerW = window.innerWidth;

    let altText = document.createElement("div");
    altText.classList.add("altText");
    altText.textContent = img.alt;
    document.body.appendChild(altText);

    fullPage.style.display = 'flex';
    fullPage.style.top = window.scrollY+'px';
    imgFullPage.style.content = 'url(' + img.src + ')';

    if (innerW > innerH && img.width < img.height) {
      imgFullPage.style.height = '70%';
    } 
      else if (innerW > innerH && img.width > img.height) {
        imgFullPage.style.width = '80%';
        imgFullPage.style.height = '90%';
    }
      else if (innerW < innerH && img.width < img.height) {
      imgFullPage.style.width = '80%';
      imgFullPage.style.height = '80%';
    } 
      else {
      imgFullPage.style.width = '90%';
      imgFullPage.style.height = '50%';
    };

    const contTop = imgFullPage.getBoundingClientRect().y;

    const contHeight = imgFullPage.getBoundingClientRect().height;
    const contWidth = imgFullPage.getBoundingClientRect().width;
    const contProp = contHeight / contWidth;

    const imageHeight = img.naturalHeight;
    const imageWidth = img.naturalWidth;
    const imageProp = imageHeight / imageWidth;

    const max = Math.max(contProp, imageProp);
    const min = Math.min(contProp, imageProp);

    const topBase = 10 + ((contTop) + (contHeight/2) + (window.scrollY));

    let result;
    function getMax (imageProp, contProp) {
      if (contProp > imageProp) { result = (contHeight/2)*(imageProp/contProp)} 
      else {result = contHeight/2}
    }

    const rest = getMax(imageProp, contProp);

    altText.style.top = topBase + result + 'px';
  });
});

fullPage.addEventListener('click', function() {
  document.body.classList.remove("stop-scrolling");
  let altTextCreated = document.getElementsByClassName('altText');
  altTextCreated[0].remove();
});

// INSERT A DASH

const containers = document.getElementsByClassName('container');

for (let container of containers) {
  const dashContainer = document.createElement ("div");
  const dash = document.createElement("div");

  dashContainer.appendChild(dash);
  container.after(dashContainer);
  
  function getRandomValue(min, max) {
    return Math.floor(Math.random() * (max - min) + min)
  }

  dashContainer.classList.add("dashContainer");
  dash.style.animationDelay = (getRandomValue(-50,0)) + 's';
  dash.classList.add("dash");
}

// AOR TO START PAGE

const aor = document.getElementById("logo");
aor.addEventListener('click', function() { 
  location = '../index.html';
});

const titulo = document.getElementById("titulo");
titulo.addEventListener('click', function() {
  window.scrollTo(0,0);
})