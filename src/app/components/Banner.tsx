import Image from "next/image";
import styles from "../styles/home.module.css";

const Banner: React.FC = () => {
  return (
    <div className={styles.banner}>
      <Image
        src="/banner.jpg"
        alt="Pokémon Banner"
        width={1600}
        height={400}
        priority
      />
      <h1 className={styles.bannerText}>Welcome to the Pokémon TCG Explorer!</h1>
    </div>
  );
};

export default Banner;
