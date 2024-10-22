function makeSlideshow(selector) {
    const slider = document.querySelector(selector);
    const slides = slider.querySelectorAll(".slider__slide");
    const prevButton = slider.querySelector(".slider__arrow--prev");
    const nextButton = slider.querySelector(".slider__arrow--next");
    const indicatorsContainer = slider.querySelector(".slider__indicators");
    
    let slideIndex = 0;
    let slideInterval;
    
    slides.forEach((_, index) => {
        const indicator = document.createElement("div");
        indicator.classList.add("slider__indicator");
        indicatorsContainer.appendChild(indicator);
    });

    const indicators = slider.querySelectorAll(".slider__indicator");

    function showSlides() {
      slides.forEach(slide => {
        slide.style.display = "none";
      });
      indicators.forEach(indicator => {
        indicator.classList.remove("slider__indicator--current");
      });
     
      slides[slideIndex].style.display = "block";
      indicators[slideIndex].classList.add("slider__indicator--current");
    }
  
    function nextSlide() {
        // slideIndex++;
        // if (slideIndex >= slides.length) {
        //   slideIndex = 0;
        // }
        slideIndex = (slideIndex + 1) % slides.length;
        showSlides();
        resetInterval();
    }
    
    function prevSlide() {
    //   slideIndex--;
    //   if (slideIndex < 0) {
    //     slideIndex = slides.length - 1;
    //   }
      slideIndex = (slideIndex - 1 + slides.length) % slides.length;
      showSlides();
      resetInterval();
    }
    
    function goToSlide(index) {
      slideIndex = index;
      showSlides();
      resetInterval();
    }
  
    function resetInterval() {
      clearInterval(slideInterval);
      slideInterval = setInterval(nextSlide, 5000);
    }
  
    nextButton.addEventListener("click", nextSlide);
    prevButton.addEventListener("click", prevSlide);
  
    indicators.forEach((indicator, index) => {
      indicator.addEventListener("click", () => goToSlide(index));
    });
  
    showSlides();
    resetInterval();
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    makeSlideshow(".slider");
    makeSlideshow(".slider_2");
  });
  