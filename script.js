
const slider = document.querySelector('.slider');
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
let currentSlide = 0;
const totalSlides = slides.length;


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


setInterval(nextSlide, 3000);


showSlide(0); 