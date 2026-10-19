import { useEffect, useState } from "react";
import slides from "../data/featured-stories.json";

function FeatureCarousel({ onSelectStory }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    const interval = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 3000);

    return () => window.clearInterval(interval);
  }, [paused]);

  function moveSlide(direction) {
    setActiveSlide((current) => (current + direction + slides.length) % slides.length);
  }

  return (
    <section
      className="feature-carousel page-width"
      aria-label="Featured images"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);
      }}
    >
      <div className="feature-carousel__viewport" aria-live="off">
        {slides.map((slide, index) => (
          <button
            type="button"
            className={`feature-carousel__slide${index === activeSlide ? " is-active" : ""}`}
            key={slide.id}
            aria-hidden={index !== activeSlide}
            tabIndex={index === activeSlide ? 0 : -1}
            aria-label={`Show story: ${slide.title}`}
            onClick={() => onSelectStory(slide.id)}
          >
            <img src={slide.image} alt={slide.imageAlt} />
            <span className="feature-carousel__shade" />
            <span className="feature-carousel__caption">
              <span className="feature-carousel__source">{slide.source}</span>
              <span className="feature-carousel__caption-title">{slide.shortTitle}</span>
              <span className="feature-carousel__caption-summary">{slide.carouselSummary}</span>
            </span>
          </button>
        ))}
      </div>
      <button className="carousel-control carousel-control--prev" type="button" aria-label="Previous slide" onClick={() => moveSlide(-1)}>
        <span aria-hidden="true">←</span>
      </button>
      <button className="carousel-control carousel-control--next" type="button" aria-label="Next slide" onClick={() => moveSlide(1)}>
        <span aria-hidden="true">→</span>
      </button>
      <div className="carousel-pagination" aria-label="Choose a slide">
        {slides.map((slide, index) => (
          <button
            type="button"
            className={index === activeSlide ? "is-active" : ""}
            key={slide.id}
            aria-label={`Show slide ${index + 1}`}
            aria-current={index === activeSlide ? "true" : undefined}
            onClick={() => setActiveSlide(index)}
          />
        ))}
      </div>
    </section>
  );
}

export default FeatureCarousel;