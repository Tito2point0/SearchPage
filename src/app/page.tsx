// src/app/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./styles/home.module.css";

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
        setError((err instanceof Error) ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }
    fetchPokemon();
  }, []);

  // Pagination calculations
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
          // Extract the Pokémon ID from the URL (used for the sprite)
          const segments = pokemon.url.split("/");
          const pokeId = segments[segments.length - 2];
          // Pass the Pokemon name (encoded) in the URL for the detail page.
          return (
            <Link key={pokeId} href={`/card/${encodeURIComponent(pokemon.name)}`}>
              <div className={styles.card}>
                <Image
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokeId}.png`}
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
