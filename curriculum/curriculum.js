// function getPics() {} //just for this demo
const imgs = document.querySelectorAll('img');
const fullPage = document.getElementById('fullpage');
const imgFullPage = document.getElementById('imageFullPage');

imgs.forEach(img => {
  img.addEventListener('click', function() {
    let innerH = window.innerHeight;
    let innerW = window.innerWidth;

    fullPage.style.display = 'flex';
    fullPage.style.top = window.scrollY+'px';
    imgFullPage.style.content = 'url(' + img.src + ')';

    if (innerW > innerH && img.width < img.height) {
      imgFullPage.style.height = '10%';
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

    document.body.classList.add("stop-scrolling");
  });
});

fullPage.addEventListener('click', function() {
  document.body.classList.remove("stop-scrolling");
});

// INSERT A DASH

const containers = document.getElementsByClassName('container');

for (let container of containers) {
  const dashContainer = document.createElement ("div");
  const dash = document.createElement("div");

  dashContainer.appendChild(dash);
  container.after(dashContainer);

  dashContainer.classList.add("dashContainer");
  dash.classList.add("dash");
}