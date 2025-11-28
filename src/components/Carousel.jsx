import React, { useState, useEffect } from "react";
import "./carousel.css";


import DoctorBG1 from "/img/DoctorBG1.jpg"; 
import DoctorBG2 from "/img/DoctorBG2.jpg"; 
import DoctorBG3 from "/img/DoctorBG3.jpeg"; 


const Carousel = () => {
  const slides = [
    { id: 1, image: DoctorBG1 },
    { id: 2, image: DoctorBG2 },
    { id: 3, image: DoctorBG3 },

  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const interval = setInterval(handleNext, 3500);
    return () => clearInterval(interval);
  }, [currentIndex]); // ให้มันเลื่อนต่อเนื่องแบบเดิม

  return (
    <div className="carousel">
      <div className="carousel-inner">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`carousel-item ${index === currentIndex ? "active" : ""}`}
          >
            <img src={slide.image} alt={`slide-${slide.id}`} />
          </div>
        ))}
      </div>

      <button className="carousel-btn prev" onClick={handlePrev}>
        &#10094;
      </button>
      <button className="carousel-btn next" onClick={handleNext}>
        &#10095;
      </button>

      <div className="carousel-dots">
        {slides.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === currentIndex ? "active" : ""}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
