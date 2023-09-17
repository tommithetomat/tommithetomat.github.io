import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.scss";

const API_KEY = "2R6F7mhJzpmZgIAPXyWmnYQUgxV-t0WAQl8TPNvUXt8";

function App() {
    const [slides, setSlides] = useState([]);
    const [activeSlide, setActiveSlide] = useState(0);
    const [touchStartX, setTouchStartX] = useState(null);
    const [touchEndX, setTouchEndX] = useState(null);
    const [autoPlay, setAutoPlay] = useState(true);

    useEffect(() => {
        axios
            .get("https://api.unsplash.com/photos/random", {
                params: {
                    client_id: API_KEY,
                    count: 5,
                    orientation: "landscape",
                },
            })
            .then((response) => {
                setSlides(response.data);
            })
            .catch((error) => {
                console.error("Ошибка при загрузке изображений:", error);
            });
    }, []);

    useEffect(() => {
        let autoPlayInterval;

        if (autoPlay) {
            autoPlayInterval = setInterval(() => {
                setActiveSlide((prevSlide) =>
                    prevSlide === slides.length - 1 ? 0 : prevSlide + 1
                );
            }, 3000);
        }

        return () => clearInterval(autoPlayInterval);
    }, [slides, autoPlay]);

    const nextSlide = () => {
        setActiveSlide((prevSlide) =>
            prevSlide === slides.length - 1 ? 0 : prevSlide + 1
        );
    };

    const prevSlide = () => {
        setActiveSlide((prevSlide) =>
            prevSlide === 0 ? slides.length - 1 : prevSlide - 1
        );
    };

    const handleTouchStart = (e) => {
        setTouchStartX(e.touches[0].clientX);
    };

    const handleTouchMove = (e) => {
        setTouchEndX(e.touches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (touchStartX && touchEndX) {
            const touchDiff = touchStartX - touchEndX;

            if (touchDiff > 50) {
                nextSlide();
            } else if (touchDiff < -50) {
                prevSlide();
            }
        }

        setTouchStartX(null);
        setTouchEndX(null);
    };

    const toggleAutoPlay = () => {
        setAutoPlay((prevAutoPlay) => !prevAutoPlay);
    };

    return (
        <div
            className="slider-container"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            <div className="toggle-container">
                <div
                    className={`toggle-switch ${autoPlay ? "on" : "off"}`}
                    onClick={toggleAutoPlay}
                >
                    <div className="toggle-knob"></div>
                </div>
                <span className="toggle-label">Автопроигрывание</span>
            </div>
            <div className="slider">
                {slides.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`slide ${
                            index === activeSlide ? "active" : ""
                        }`}
                    >
                        <img
                            src={slide.urls.regular}
                            alt={slide.description || "No description"}
                        />
                    </div>
                ))}

                <button className="prev-button" onClick={prevSlide}>
                    ⟨
                </button>
                <button className="next-button" onClick={nextSlide}>
                    ⟩
                </button>
            </div>
            <div className="slide-description">
                <h3>
                    {slides[activeSlide]?.description ||
                        "( ͡°( ͡° ͜ʖ( ͡° ͜ʖ ͡°)ʖ ͡°) ͡°)"}
                </h3>
            </div>
            <div className="indicators">
                {slides.map((_, index) => (
                    <div
                        key={index}
                        className={`indicator ${
                            index === activeSlide ? "active" : ""
                        }`}
                        onClick={() => setActiveSlide(index)}
                    ></div>
                ))}
            </div>
        </div>
    );
}

export default App;