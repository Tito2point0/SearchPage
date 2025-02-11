"use client";  // Ensures this runs only on the client side

import React from "react";
import Slider from "react-slick";
import Image from "next/image";
import Link from "next/link";  // Import Next.js Link
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import styles from "../styles/home.module.css";

// Define the props for Carousel
interface CarouselProps {
  images: { id: string; src: string }[];  // Now each Pokémon image has an `id`
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
        {images.map((pokemon) => (
          <div key={pokemon.id} className={styles.slide}>
            {/* Wrap each image in a Next.js Link */}
            <Link href={`/pokemon/${pokemon.id}`}>
              <Image src={pokemon.src} alt={`Pokemon ${pokemon.id}`} width={400} height={600} />
            </Link>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Carousel;
