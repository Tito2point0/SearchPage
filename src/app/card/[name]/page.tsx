"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import styles from "../../styles//home.module.css";

interface Card {
  id: string;
  name: string;
  images: {
    small: string;
    large: string;
    };
  }

export default function CardDetailPage() {
  const { name } = useParams();
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!name) return;

    async function fetchCardData() {
      try {
        const apiKey = process.env.NEXT_PUBLIC_POKEMON_TCG_API_KEY || "";
        const url = `https://api.pokemontcg.io/v2/cards?q=name:${encodeURIComponent(name as string)}`;
        
        console.log("Fetching TCG Cards from:", url);
        
        const res = await fetch(url, {
          headers: {
            "X-Api-Key": apiKey,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch card details.");
        const data = await res.json();

        setCards(data.data || []);
        setLoading(false);

        setCards(data.data || []);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred.");
        }
      }
    }
    fetchCardData();
  }, [name]);

  if (loading) return <p>Loading card details...</p>;
  if (error) return <p>{error}</p>;
  if (cards.length === 0) return <p>No cards found for &quot;{name}&quot;.</p>;

  return (
    <div className={styles.container}>
      <h1>Cards for {((name as string) || "Unknown").toUpperCase()}</h1>
      <div className={styles.grid}>
        {cards.map((card) => (
          <div key={card.id} className={styles.card}>
            <Image
              src={card.images.small}
              alt={card.name}
              width={150}
              height={210}
            />
            <h3>{card.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}
