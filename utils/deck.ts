export const suits = ["♠", "♥", "♦", "♣"];
export const ranks = [
   { rank: "K", value: 13 },
   { rank: "Q", value: 12 },
   { rank: "J", value: 11 },
   { rank: "10", value: 10 },
   { rank: "9", value: 9 },
   { rank: "8", value: 8 },
   { rank: "7", value: 7 },
   { rank: "6", value: 6 },
   { rank: "5", value: 5 },
   { rank: "4", value: 4 },
   { rank: "3", value: 3 },
   { rank: "2", value: 2 },
   { rank: "A", value: 1 }
];

export type Card = {
   suit: string;
   rank: string;
   value: number;
};

export function createDeck(): Card[] {
   const deck: Card[] = [];
   suits.forEach(suit => {
      ranks.forEach(({ rank, value }) => {
         deck.push({ suit, rank, value });
      });
   });
   return deck;
}

export function shuffleDeck(deck: Card[]): Card[] {
   for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
   }
   return deck;
}
