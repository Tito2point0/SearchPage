// src/app/page.tsx
"use client"; // Mark this as a client component since we’re using state and effects

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./styles/home.module.css";

// TypeScript interface for each Pokémon entry in the list
interface Pokemon {
  name: string;
  url: string;
}

const POKEMON_API = "https://pokeapi.co/api/v2/pokemon?limit=151";

export default function HomePage() {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 12;

  useEffect(() => {
    async function fetchPokemon() {
      try {
        const res = await fetch(POKEMON_API);
        if (!res.ok) {
          throw new Error("Failed to fetch Pokémon data");
        }
        const data = await res.json();
        setPokemonList(data.results);
      } catch (err) {
        console.error(err);
        setError("Failed to load Pokémon. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    fetchPokemon();
  }, []);

  // Calculate pagination
  const totalPages = Math.ceil(pokemonList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPokemon = pokemonList.slice(startIndex, startIndex + itemsPerPage);

  if (loading) return <p>Loading Pokémon...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Pokémon Explorer</h1>
      <div className={styles.grid}>
        {currentPokemon.map((pokemon) => {
          // Extract Pokémon ID from the URL (the ID is the second-to-last segment)
          const segments = pokemon.url.split("/");
          const id = segments[segments.length - 2];
          return (
            <Link key={id} href={`/pokemon/${id}`}>
              <div className={styles.card}>
                <Image
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`}
                  alt={pokemon.name}
                  width={100}
                  height={100}
                  priority
                />
                <h3>{pokemon.name.toUpperCase()}</h3>
              </div>
            </Link>
          );
        })}
      </div>
      <div className={styles.pagination}>
        <button
          className={styles.button}
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Prev
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className={styles.button}
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
