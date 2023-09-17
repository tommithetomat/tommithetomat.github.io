import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import { useSwipeable } from "react-swipeable";

const API_KEY = "2R6F7mhJzpmZgIAPXyWmnYQUgxV-t0WAQl8TPNvUXt8"; 

function App() {
    const [slides, setSlides] = useState([]);
    const [activeSlide, setActiveSlide] = useState(0);

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
        const autoPlayInterval = setInterval(() => {
            setActiveSlide((prevSlide) =>
                prevSlide === slides.length - 1 ? 0 : prevSlide + 1
            );
        }, 1000); 

        return () => clearInterval(autoPlayInterval);
    }, [slides]);

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

	const handlers = useSwipeable({
		onSwipedLeft: () => nextSlide(),
		onSwipedRight: () => prevSlide(),
	})

    return (
        <div className="slider-container">
                <div className="slider" {...handlers}>
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
                <h3>{slides[activeSlide]?.description || "( ͡°( ͡° ͜ʖ( ͡° ͜ʖ ͡°)ʖ ͡°) ͡°)"}</h3>
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