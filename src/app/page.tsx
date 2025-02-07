import Head from "next/head";
import Banner from "./components/Banner";
import Carousel from "./components/Carousel";
import styles from "./styles/home.module.css";

// Pokémon images for carousel (replace with API later)
const pokemonImages = [
  "/pokemon1.WEBP",
  "/pokemon2.jpg",
  "/pokemon3.jpg",
  "/pokemon4.jpg",
];

const Home: React.FC = () => {
  return (
    <>
      <Head>
        <title>Pokémon TCG Explorer</title>
        <meta name="description" content="Explore Pokémon TCG Cards" />
      </Head>

      <main className={styles.main}>
        <Banner />
        <Carousel images={pokemonImages} />
      </main>
    </>
  );
};

export default Home;
