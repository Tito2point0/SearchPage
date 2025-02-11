"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import styles from "../../../styles/home.module.css"; // Adjust path if needed

// Define the interface for detailed card data
interface CardDetail {
  id: string;
  name: string;
  supertype: string;
  subtypes?: string[];
  hp?: string;
  types?: string[];
  evolvesFrom?: string;
  abilities?: {
    name: string;
    text: string;
    type: string;
  }[];
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
  retreatCost?: string[];
  convertedRetreatCost?: number;
  set?: {
    id: string;
    name: string;
    series: string;
    printedTotal: number;
    total: number;
    legalities: {
      unlimited?: string;
      standard?: string;
      expanded?: string;
    };
    ptcgoCode: string;
    releaseDate: string;
    updatedAt: string;
    images: {
      symbol: string;
      logo: string;
    };
  };
  number?: string;
  artist?: string;
  rarity?: string;
  flavorText?: string;
  nationalPokedexNumbers?: number[];
  legalities?: {
    unlimited?: string;
    standard?: string;
    expanded?: string;
  };
  images: {
    small: string;
    large: string;
  };
  tcgplayer?: {
    url: string;
    updatedAt: string;
    prices?: {
      normal?: {
        low?: number;
        mid?: number;
        high?: number;
        market?: number;
        directLow?: number;
      };
      reverseHolofoil?: {
        low?: number;
        mid?: number;
        high?: number;
        market?: number;
        directLow?: number;
      };
    };
  };
  cardmarket?: {
    url: string;
    updatedAt: string;
    prices?: {
      averageSellPrice?: number;
      lowPrice?: number;
      trendPrice?: number;
      suggestedPrice?: number;
      reverseHoloSell?: number;
      reverseHoloLow?: number;
      reverseHoloTrend?: number;
      lowPriceExPlus?: number;
      avg1?: number;
      avg7?: number;
      avg30?: number;
    };
  };
}

export default function CardDetailPage() {
  // Extract the dynamic cardId from the URL
  const { cardId } = useParams() as { cardId: string };
  const [card, setCard] = useState<CardDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!cardId) return;

    async function fetchCardDetail() {
      try {
        const apiKey = process.env.NEXT_PUBLIC_POKEMON_TCG_API_KEY || "";
        const url = `https://api.pokemontcg.io/v2/cards/${encodeURIComponent(cardId)}`;
        const res = await fetch(url, {
          headers: {
            "X-Api-Key": apiKey,
          },
        });
        if (!res.ok) {
          throw new Error("Failed to fetch card details");
        }
        const data = await res.json();
        console.log("Fetched detailed card data:", data);
        setCard(data.data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
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
      <Image
        src={card.images.large}
        alt={card.name}
        width={300}
        height={420}
        priority
      />

      <p><strong>Supertype:</strong> {card.supertype}</p>
      {card.subtypes && <p><strong>Subtypes:</strong> {card.subtypes.join(", ")}</p>}
      {card.evolvesFrom && <p><strong>Evolves From:</strong> {card.evolvesFrom}</p>}
      <p><strong>HP:</strong> {card.hp || "N/A"}</p>
      <p><strong>Types:</strong> {card.types?.join(", ") || "N/A"}</p>
      <p><strong>Rarity:</strong> {card.rarity || "N/A"}</p>

      {card.abilities && (
        <div>
          <h2>Abilities</h2>
          {card.abilities.map((ability, index) => (
            <div key={index}>
              <p><strong>{ability.name}</strong> ({ability.type})</p>
              <p>{ability.text}</p>
            </div>
          ))}
        </div>
      )}

      {card.attacks && (
        <div>
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

      {card.weaknesses && (
        <div>
          <h2>Weaknesses</h2>
          {card.weaknesses.map((weakness, index) => (
            <p key={index}>
              {weakness.type}: {weakness.value}
            </p>
          ))}
        </div>
      )}

      {card.set && (
        <div>
          <h2>Set Information</h2>
          <p><strong>Set Name:</strong> {card.set.name}</p>
          <p><strong>Series:</strong> {card.set.series}</p>
          <p><strong>Release Date:</strong> {card.set.releaseDate}</p>
          <p>
            <Image
              src={card.set.images.logo}
              alt="Set Logo"
              width={100}
              height={50}
            />
          </p>
        </div>
      )}

      {card.tcgplayer && (
        <div>
          <h2>TCGPlayer Prices</h2>
          <p><a href={card.tcgplayer.url} target="_blank" rel="noopener noreferrer">View on TCGPlayer</a></p>
          {card.tcgplayer.prices?.normal && (
            <p>Normal: ${card.tcgplayer.prices.normal.market}</p>
          )}
          {card.tcgplayer.prices?.reverseHolofoil && (
            <p>Reverse Holofoil: ${card.tcgplayer.prices.reverseHolofoil.market}</p>
          )}
        </div>
      )}

      {card.cardmarket && (
        <div>
          <h2>CardMarket Prices</h2>
          <p><a href={card.cardmarket.url} target="_blank" rel="noopener noreferrer">View on CardMarket</a></p>
          {card.cardmarket.prices?.averageSellPrice && (
            <p>Avg Sell Price: ${card.cardmarket.prices.averageSellPrice}</p>
          )}
        </div>
      )}

      {card.flavorText && <p><em>{card.flavorText}</em></p>}
    </div>
  );
}
