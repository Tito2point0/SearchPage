"use client"

import React from "react";
import Slider from "react-slick";
import Image from "next/image";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import styles from "../styles/home.module.css";

// Define props type
interface CarouselProps {
  images: string[];
}

const Carousel: React.FC<CarouselProps> = ({ images }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className={styles.carouselContainer}>
      <Slider {...settings}>
        {images.map((img, index) => (
          <div key={index} className={styles.slide}>
            <Image src={img} alt={`Pokemon ${index}`} width={400} height={600} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Carousel;
