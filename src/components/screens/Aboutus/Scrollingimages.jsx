import React, { useEffect, useRef } from "react";
import banner from "./../../../assests/images/swimmmingpool.jpg";
import banner1 from "./../../../assests/images/gardenarea.webp";
import banner2 from "./../../../assests/images/balcony.jpg";
import banner3 from "./../../../assests/images/gym.png";
import "./scrollingimages.css";

const images = [
  { src: banner, name: "Swimming Pool" },
  { src: banner1, name: "Garden Area" },
  { src: banner2, name: "Balcony" },
  { src: banner3, name: "Gym" },
];

const ScrollingImages = () => {
  const wrapperRef = useRef(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    let scrollAmount = 0;

    const scrollImages = () => {
      if (wrapper) {
        scrollAmount += 1;
        if (scrollAmount >= wrapper.scrollHeight / 2) {
          scrollAmount = 0;
        }
        wrapper.style.transform = `translateY(-${scrollAmount}px)`;
        wrapper.style.transition = "transform 0.5s ease-in-out";
      }
      requestAnimationFrame(scrollImages);
    };
    scrollImages();
  }, []);

  return (
   <>
    <div className="testimonials-heading">
            <h2>ANemitics</h2>
        </div>
    <div className="scrolling-container">
       
      <div className="scrolling-wrapper" ref={wrapperRef}>
        {[...images, ...images].map((img, idx) => (
          <div key={idx} className="scrolling-image-container">
            <div className="image-with-heading">
              <img
                src={img.src}
                alt={`Banner ${idx + 1}`}
                className="scrolling-image"
              />
              <h2 className="image-heading">{img.name}</h2>
            </div>
          </div>
        ))}
      </div>
    </div>
   
   
   </>
  );
};

export default ScrollingImages;
