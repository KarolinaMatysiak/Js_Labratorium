
const slider = document.querySelector('.slider');
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
const pauseButton = document.querySelector('.pause-button');
let currentSlide = 0;
const totalSlides = slides.length;


let sliderInterval;
let isPaused = false;


function showSlide(slideNumber) {

    slider.style.transform = 'translateX(-' + (slideNumber * 100) + '%)';
    

    for(let i = 0; i < dots.length; i++) {
        if(i === slideNumber) {
            dots[i].className = 'dot active';
        } else {
            dots[i].className = 'dot';
        }
    }
    

    currentSlide = slideNumber;
}


function nextSlide() {
    if(currentSlide >= totalSlides - 1) {

        showSlide(0);
    } else {
     
        showSlide(currentSlide + 1);
    }
}

function prevSlide() {
    if(currentSlide <= 0) {
        showSlide(totalSlides - 1);
    } else {
    
        showSlide(currentSlide - 1);
    }
}

function autoSlide() {
    isPaused = !isPaused;

    if (isPaused) {
        pauseButton.className = 'pause-button paused';
 
        clearInterval(sliderInterval);
    } else {
        pauseButton.className = 'pause-button';
 
        startSliderInterval();
    }
}


function startSliderInterval() {

    if (sliderInterval) {
        clearInterval(sliderInterval);
    }

    sliderInterval = setInterval(nextSlide, 3000);
}

showSlide(0);
startSliderInterval(); 