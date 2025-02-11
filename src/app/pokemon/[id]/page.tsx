"use client"; // ✅ Marks this as a Client Component

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation"; // ✅ Replaces useRouter for Next.js App Router
import Image from "next/image";
import styles from "../../styles/home.module.css"; // ✅ Adjusted relative path

// Define TypeScript Interfaces
interface Ability {
  ability: {
    name: string;
  };
}

interface Stat {
  base_stat: number;
  stat: {
    name: string;
  };
}

interface Pokemon {
  name: string;
  sprites: {
    other?: {
      "official-artwork"?: {
        front_default?: string;
      };
    };
  };
  abilities: Ability[];
  stats: Stat[];
}

export default function PokemonDetail() {
  const pathname = usePathname(); // ✅ Get the current path
  const id = pathname.split("/").pop(); // Extract Pokémon ID from URL

  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchPokemonDetails = async () => {
      try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        if (!res.ok) throw new Error("Failed to fetch Pokémon details.");
        const data = await res.json();
        setPokemon(data);
      } catch {
        setError("Failed to load Pokémon details.");
      } finally {
        setLoading(false);
      }
    };

    fetchPokemonDetails();
  }, [id]);

  if (loading) return <p>Loading Pokémon...</p>;
  if (error) return <p>{error}</p>;
  if (!pokemon) return <p>Pokémon not found.</p>;

  return (
    <div className={styles.container}>
      <h1>{pokemon.name.toUpperCase()}</h1>
      <Image
        src={pokemon.sprites.other?.["official-artwork"]?.front_default || "/fallback.png"}
        alt={pokemon.name}
        width={300}
        height={300}
        priority
      />
      
      <h3>Abilities:</h3>
      <ul>
        {pokemon.abilities.map((ability, index) => (
          <li key={index}>{ability.ability.name}</li>
        ))}
      </ul>

      <h3>Base Stats:</h3>
      <ul>
        {pokemon.stats.map((stat, index) => (
          <li key={index}>
            {stat.stat.name.toUpperCase()}: {stat.base_stat}
          </li>
        ))}
      </ul>
    </div>
  );
}
