//Remove animations on load
window.onload = function () {
    document.querySelector('body').classList.remove('perf-no-animation');
}

//100vh hack
var vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty("--vh", "".concat(vh, "px"));
window.addEventListener("resize", function () {
    var vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", "".concat(vh, "px"));
});

//Mobile menu init
function mobileMenu() {
    var toggle = document.querySelector('.header__burger');
    var menu = document.querySelector('.mobileMenu');
    var body = document.querySelector('body');

    this.onOpen = function () {
        toggle.classList.add('open');
        menu.classList.add('opened');
        body.classList.add('mobile');
        return true;
    };

    this.onClose = function () {
        toggle.classList.remove('open');
        menu.classList.remove('opened');
        body.classList.remove('mobile');
    }

    this.onToggle = function (){
        toggle.classList.toggle('open');
        menu.classList.toggle('opened');
        body.classList.toggle('mobile');
    }
}

var mobileMenu = new mobileMenu();

var headerBurger = document.querySelector('.header__burger');
headerBurger.addEventListener('click', function (){
    mobileMenu.onOpen();
})

var headerClose = document.querySelector('.mobileMenu-header__toggle');
headerClose.addEventListener('click', function (){
    mobileMenu.onClose();
})

var navLinks = document.querySelectorAll('.mobileMenu-nav__ul li a');
for (var i = 0; i < navLinks.length; i++) {
    navLinks[i].addEventListener('click', function () {
        mobileMenu.onClose();
    });
}

var results = document.getElementById('resultss');
var body = document.querySelector('body');
results.addEventListener('click', function(){
    document.querySelector('.results').classList.add('is-active');
    body.classList.add('is-results');
})

//Browser-level image lazy-loading
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    for (var i = 0; i < images.length; i++) {
        images[i].src = images[i].dataset.src;
    }
} else {
    const script = document.createElement('script');
    script.src = '/js/lazysizes.min.js';
    document.body.appendChild(script);
}

var tab = document.querySelectorAll('.results .tabs__tab');
var tabContent = document.querySelectorAll('.results .tab-content');
for (var i = 0; i < tab.length; i++){
    tab[i].addEventListener('click',function(index){
        tab.forEach(element => {
            element.classList.remove('is-active');     
        });
        tabContent.forEach(element => {
            element.classList.remove('is-active');     
        });
        var dataTab = this.getAttribute('data-tab');
        this.classList.add('is-active');
        document.querySelector('.results .tab-content[data-tab="'+dataTab+ '"]').classList.add('is-active');
    })
}

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('/sw.js');
    });
}

document.addEventListener('click',function(e){
    if(e.target && e.target.classList.contains('item__copyBtn')){
        var copyBtn = e.target;
        var text = copyBtn.parentNode.querySelector('.item__text');
        navigator.clipboard.writeText(text.textContent);
     }
     if(e.target && e.target.classList.contains('item__shareBtn')){
        var copyBtn = e.target;
        var text = copyBtn.parentNode.querySelector('.item__text');
        navigator.share({
            text: text.textContent,
        });
     }
 });