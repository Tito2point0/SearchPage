import { useState, useEffect } from "react";
import Link from "next/link";
// import Image from "next/image";
import styles from "../styles/home.module.css";

interface Pokemon {
  name: string;
  url: string;
}

const POKEMON_API = "https://pokeapi.co/api/v2/pokemon?limit=151";

export default function Home() {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 12;

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const res = await fetch(POKEMON_API);
        if (!res.ok) throw new Error("Failed to fetch Pokémon data.");
        const data = await res.json();
        setPokemonList(data.results);
      } catch {
        setError("Failed to load Pokémon. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchPokemon();
  }, []);

  // Pagination Logic
  const startIndex = (currentPage - 1) * itemsPerPage;
  const selectedPokemon = pokemonList.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(pokemonList.length / itemsPerPage);

  if (loading) return <p>Loading Pokémon...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Pokémon Explorer</h1>

      <div className={styles.grid}>
        {selectedPokemon.map((pokemon) => {
          const pokemonId = pokemon.url.split("/")[6]; // Extract ID from URL
          return (
            <Link key={pokemonId} href={`/pokemon/${pokemonId}`} passHref>
              <div className={styles.card}>
                <img
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`}
                  alt={pokemon.name}
                  width={100}
                  height={100}
                />
                <h3>{pokemon.name.toUpperCase()}</h3>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Pagination Controls */}
      <div className={styles.pagination}>
        <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>◀ Prev</button>
        <span>Page {currentPage} of {totalPages}</span>
        <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>Next ▶</button>
      </div>
    </div>
  );
}
