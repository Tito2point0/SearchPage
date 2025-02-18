"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
// import Image from "next/image";
import styles from "../../../styles/home.module.css";

interface CardDetail {
  id: string;
  name: string;
  supertype: string;
  subtypes?: string[];
  hp?: string;
  types?: string[];
  evolvesFrom?: string;
  abilities?: { name: string; text: string; type: string }[];
  attacks?: {
    name: string;
    cost: string[];
    convertedEnergyCost: number;
    damage: string;
    text: string;
  }[];
  weaknesses?: { type: string; value: string }[];
  retreatCost?: string[];
  set?: {
    id: string;
    name: string;
    series: string;
    releaseDate: string;
    images: { logo: string };
  };
  rarity?: string;
  flavorText?: string;
  images: { large: string };
  tcgplayer?: { url: string; prices?: { normal?: { market?: number } } };
  cardmarket?: { url: string; prices?: { averageSellPrice?: number } };
}

export default function CardDetailPage() {
  const { cardId } = useParams() as { cardId: string };
  const [card, setCard] = useState<CardDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!cardId) return;

    async function fetchCardDetail() {
      try {
        const apiKey = process.env.NEXT_PUBLIC_POKEMON_TCG_API_KEY || "";
        const url = `https://api.pokemontcg.io/v2/cards/${encodeURIComponent(
          cardId
        )}`;
  
        console.log("Fetching from:", url); // Check the API call
        console.log("Using API Key:", apiKey ? "Set" : "Missing"); // Ensure API Key is present
    

        const res = await fetch(url, { headers: { "X-Api-Key": apiKey } });

        if (!res.ok) throw new Error("Failed to fetch card details");

        const data = await res.json();
        console.log("Fetched detailed card data:", data);
        setCard(data.data);
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchCardDetail();
  }, [cardId]);

  if (loading) return <p>Loading card details...</p>;
  if (error) return <p>{error}</p>;
  if (!card) return <p>Card not found.</p>;

  return (
    <div className={styles.detailContainer}>
      <h1>{card.name}</h1>

      <div className={styles.cardContent}>
        {/* Left Side: Card Image */}
        <div className={styles.cardImage}>
          <img
            src={card.images.large}
            alt={card.name}
            width={300}
            height={420}
          />
          {card.set?.images.logo && (
            <img
              src={card.set.images.logo}
              alt="Set Logo"
              className={styles.setLogo}
              width={80}
              height={40}
            />
          )}
        </div>

        {/* Right Side: Stats and Details */}
        <div className={styles.cardStats}>
          <p>
            <strong>Supertype:</strong> {card.supertype}
          </p>
          {card.subtypes && (
            <p>
              <strong>Subtypes:</strong> {card.subtypes.join(", ")}
            </p>
          )}
          {card.evolvesFrom && (
            <p>
              <strong>Evolves From:</strong> {card.evolvesFrom}
            </p>
          )}
          <p>
            <strong>HP:</strong> {card.hp || "N/A"}
          </p>
          <p>
            <strong>Types:</strong> {card.types?.join(", ") || "N/A"}
          </p>
          <p>
            <strong>Rarity:</strong> {card.rarity || "N/A"}
          </p>

          {/* Abilities */}
          {card.abilities && (
            <div className={styles.abilityContainer}>
              <h2>Abilities</h2>
              {card.abilities.map((ability, index) => (
                <div key={index}>
                  <p>
                    <strong>{ability.name}</strong> ({ability.type})
                  </p>
                  <p>{ability.text}</p>
                </div>
              ))}
            </div>
          )}

          {/* Attacks */}
          {card.attacks && (
            <div className={styles.attackContainer}>
              <h2>Attacks</h2>
              {card.attacks.map((attack, index) => (
                <div key={index}>
                  <p>
                    <strong>{attack.name}</strong> (Damage: {attack.damage})
                  </p>
                  <p>Effect: {attack.text}</p>
                  <p>Energy Cost: {attack.cost.join(", ")}</p>
                </div>
              ))}
            </div>
          )}

          {/* Weaknesses */}
          {card.weaknesses && (
            <div className={styles.weaknessContainer}>
              <h2>Weaknesses</h2>
              {card.weaknesses.map((weakness, index) => (
                <p key={index}>
                  {weakness.type}: {weakness.value}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className={styles.divider}></div>

      {/* TCG Prices */}
      <div className={styles.tcgPrices}>
        <h2>TCGPlayer Prices</h2>
        <p>
          <a
            href={card.tcgplayer?.url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.tcgButton}
          >
            View on TCGPlayer
          </a>
        </p>
        {card.tcgplayer?.prices?.normal && (
          <p>Normal Price: ${card.tcgplayer.prices.normal.market}</p>
        )}
      </div>
    </div>
  );
}
