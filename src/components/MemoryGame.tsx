"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

type Card = {
  id: number;
  imageUrl: string;
  isFlipped: boolean;
  isMatched: boolean;
};

type MemoryGameProps = {
  images: string[];
};

function shuffleCards(cards: string[]): string[] {
  return cards.sort(() => Math.random() - 0.5);
}

function initializeCards(images: string[]): Card[] {
  const duplicatedImages = [...images, ...images];
  const shuffled = shuffleCards(duplicatedImages);
  return shuffled.map((imageUrl, index) => ({
    id: index,
    imageUrl,
    isFlipped: false,
    isMatched: false,
  }));
}

export default function MemoryGame({ images }: MemoryGameProps) {
  const [cards, setCards] = useState<Card[]>([]);
  const [finished, setFinished] = useState<boolean>(false);

  useEffect(() => {
    setCards(initializeCards(images));
  }, [images]);

  const restartGame = () => {
    setFinished(false);
    setCards(initializeCards(images));
  };

  const handleMatchCard = (firstCard: Card, secondCard: Card) => {
    const isMatched = firstCard.imageUrl === secondCard.imageUrl;

    setTimeout(() => {
      setCards((prev) => {
        const newCards = [...prev];

        if (isMatched) {
          newCards[firstCard.id].isMatched = true;
          newCards[secondCard.id].isMatched = true;

          if (newCards.every((card) => card.isMatched)) {
            setFinished(true);
          }
        } else {
          newCards[firstCard.id].isFlipped = false;
          newCards[secondCard.id].isFlipped = false;
        }
        return newCards;
      });
    }, 500);
  };

  const handleCardClick = (clickedCard: Card) => {
    if (clickedCard.isFlipped || clickedCard.isMatched) return;

    setCards((prev) => {
      const newCards = [...prev];
      newCards[clickedCard.id].isFlipped = true;
      const flippedCards = newCards.filter((card) => card.isFlipped && !card.isMatched);
      if (flippedCards.length === 2) {
        handleMatchCard(flippedCards[0], flippedCards[1]);
      }
      return newCards;
    });
  };

  return (
    <>
      <Button variant="outline" onClick={() => restartGame()}>
        Restart
      </Button>
      <section className="flex flex-wrap md:grid md:grid-cols-12 gap-4">
        {cards.map((card) => (
          <div
            key={card.id}
            onClick={() => handleCardClick(card)}
            className={`col-span-3 bg-gray-200 h-24 w-24 md:w-64 md:h-64 cursor-pointer rounded-lg transition-all duration-500 ${
              card.isFlipped || card.isMatched ? "rotate-0" : "rotate-180 bg-primary-700"
            }`}
          >
            {(card.isFlipped || card.isMatched) && (
              <Image
                src={card.imageUrl}
                alt="Card"
                className="h-24 w-24 md:w-64 md:h-64 rounded-lg object-cover"
                width={500}
                height={550}
              />
            )}
          </div>
        ))}

        <Dialog open={finished} onOpenChange={() => restartGame()}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Congratulations!</DialogTitle>
              <DialogDescription>You&apos;ve completely nailed it.</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </section>
    </>
  );
}
