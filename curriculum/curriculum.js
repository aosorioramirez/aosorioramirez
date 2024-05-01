// function getPics() {} //just for this demo
const imgs = document.querySelectorAll('img');
const fullPage = document.getElementById('fullpage');
const imgFullPage = document.getElementById('imageFullPage');

imgs.forEach(img => {
  img.addEventListener('click', function() {
    imgFullPage.style.content = 'url(' + img.src + ')';
    fullPage.style.display = 'flex';
    fullPage.style.top = window.scrollY+'px';

    document.body.classList.add("stop-scrolling");
  });
});

fullPage.addEventListener('click', function() {
  document.body.classList.remove("stop-scrolling");
});

