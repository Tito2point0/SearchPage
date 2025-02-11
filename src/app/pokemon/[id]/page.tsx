// src/app/card/[name]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation"; // For dynamic route parameters
import Image from "next/image";
import styles from "../../styles/home.module.css";
import Link from "next/link";

interface Card {
  id: string;
  name: string;
  supertype: string;
  subtypes: string[];
  hp: string;
  types: string[];
  attacks?: {
    name: string;
    cost: string[];
    convertedEnergyCost: number;
    damage: string;
    text: string;
  }[];
  weaknesses?: {
    type: string;
    value: string;
  }[];
  images: {
    small: string;
    large: string;
  };
}

export default function CardDetailPage() {
  // Get the 'name' parameter from the URL (this is the Pokemon name)
  const { name } = useParams();
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!name) return;

    async function fetchCardData() {
      try {
        // Use your API key (if required) from environment variables
        const apiKey = process.env.NEXT_PUBLIC_POKEMON_TCG_API_KEY || "";
        // Build the URL to search for cards by Pokemon name (using the 'q' query parameter)
        const url = `https://api.pokemontcg.io/v2/cards?q=name:${encodeURIComponent(name as string)}`;
        const res = await fetch(url, {
          headers: {
            "X-Api-Key": apiKey,
          },
        });
        if (!res.ok) {
          throw new Error("Failed to fetch card details");
        }
        const data = await res.json();
        console.log("Fetched card data:", data); // Console log the API response
        if (data.data) {
          setCards(data.data);
        } else {
          throw new Error("No card data returned");
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An error occurred");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchCardData();
  }, [name]);

  if (loading) return <p>Loading card details...</p>;
  if (error) return <p>{error}</p>;
  if (cards.length === 0)
    return <p>No cards found for &quot;{name}&quot;.</p>;

  return (
    <div className={styles.detailContainer}>
      <h1>Cards for {typeof name === 'string' ? name.toUpperCase() : "Unknown"}</h1>
      <div className={styles.detailCardGrid}>
        {cards.map((card) => (
                 <Link key={card.id} href={`/card/details/${encodeURIComponent(card.id)}`}>

            <Image
              src={card.images.small}
              alt={card.name}
              width={150}
              height={210}
              priority
            />
            <h3>{card.name}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
}
