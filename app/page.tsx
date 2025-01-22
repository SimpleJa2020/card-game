"use client";

import { useState, useEffect } from "react";
import { createDeck, shuffleDeck, Card } from "@/utils/deck";
import { LiaRobotSolid } from "react-icons/lia";
import { GrUserManager } from "react-icons/gr";

export default function Game() {
   const [playerHand, setPlayerHand] = useState<Card[]>([]);
   const [botHand, setBotHand] = useState<Card[]>([]);
   const [centerCards, setCenterCards] = useState<Card[]>([]);
   const [playerScore, setPlayerScore] = useState(0);
   const [botScore, setBotScore] = useState(0);
   const [log, setLog] = useState<string[]>([]);
   const [gameOver, setGameOver] = useState(false);

   useEffect(() => {
      resetGame();
   }, []);

   const resetGame = () => {
      const deck = shuffleDeck(createDeck());
      setPlayerHand(deck.slice(0, 7));
      setBotHand(deck.slice(7, 14));
      setCenterCards([]);
      setPlayerScore(0);
      setBotScore(0);
      setLog([]);
      setGameOver(false);
   };

   const playRound = (playerCardIndex: number) => {
      const playerCard = playerHand[playerCardIndex];
      const botCard = botHand[0];

      // Remove the played cards from the hands
      setPlayerHand(playerHand.filter((_, i) => i !== playerCardIndex));
      setBotHand(botHand.slice(1));
      setCenterCards([playerCard, botCard]);

      if (playerCard.value > botCard.value) {
         // Player wins the round
         setPlayerScore(prev => prev + 1);
         setLog(prev => [
            ...prev,
            `Player wins: ${playerCard.rank} > ${botCard.rank}`
         ]);
      } else if (playerCard.value < botCard.value) {
         // Bot wins the round
         setBotScore(prev => prev + 1);
         setLog(prev => [
            ...prev,
            `Bot wins: ${botCard.rank} > ${playerCard.rank}`
         ]);
      } else {
         // Tie by card value
         setLog(prev => [...prev, `Tie: ${playerCard.rank} = ${botCard.rank}`]);

         // Handle tie logic
         if (playerHand.length === 1 && botHand.length === 1) {
            const remainingDeck = shuffleDeck(createDeck()).slice(14); // Generate a new deck
            if (remainingDeck.length >= 2) {
               // Add new cards to both hands and continue the game
               setPlayerHand(prev => [...prev, remainingDeck[0]]);
               setBotHand(prev => [...prev, remainingDeck[1]]);
               return; // Continue the game
            } else {
               // No cards left to draw
               setLog(prev => [
                  ...prev,
                  `No cards left to draw. Game ends in a tie.`
               ]);
               setGameOver(true);
               return;
            }
         }

         // Regular tie logic (add cards if available)
         if (playerHand.length > 1 || botHand.length > 1) {
            const remainingDeck = shuffleDeck(createDeck()).slice(14); // Generate a new deck
            if (remainingDeck.length >= 2) {
               setPlayerHand(prev => [...prev, remainingDeck[0]]);
               setBotHand(prev => [...prev, remainingDeck[1]]);
               setLog(prev => [
                  ...prev,
                  `Both players draw new cards due to a tie.`
               ]);
            } else {
               // If no cards are left to draw, end the game
               setLog(prev => [
                  ...prev,
                  `No cards left to draw. Game ends in a tie.`
               ]);
               setGameOver(true);
            }
         }
      }

      // End the game only if both hands are empty
      if (playerHand.length === 1 && botHand.length === 1) {
         setGameOver(true);
      }
   };

   return (
      <div className="p-8">
         <h1 className="text-2xl font-bold mb-4 text-center text-green-600">
            Big Point - Small Point Game
         </h1>
         <div className="flex justify-between mb-4">
            <div className="flex flex-col items-start">
               <div className="flex items-end mb-2">
                  <GrUserManager className="w-20 h-20" />
                  <h2 className="font-bold  text-blue-500">Player's Hand</h2>
               </div>
               <div className="flex gap-2">
                  {playerHand.map((card, index) => (
                     <button
                        key={index}
                        onClick={() => playRound(index)}
                        className="p-2 bg-blue-500 text-white rounded"
                     >
                        {card.rank} of {card.suit}
                     </button>
                  ))}
               </div>
               <p className="font-bold ">Score: {playerScore}</p>
            </div>
            <div className="flex flex-col items-start">
               <div className="flex items-end">
                  <LiaRobotSolid className="w-20 h-20" />
                  <h2 className="font-bold  text-red-600">Bot's Hand</h2>
               </div>
               <div className="flex gap-2">
                  {botHand.map((_, index) => (
                     <div
                        key={index}
                        className="p-2 bg-gray-500 text-white rounded"
                     >
                        Hidden
                     </div>
                  ))}
               </div>
               <p className="font-bold">Score: {botScore}</p>
            </div>
         </div>
         <div className="flex flex-col justify-center items-center">
            <div className="mb-4 ">
               <h2 className="text-center mb-2 font-bold">Center Cards</h2>
               <div className="flex gap-2">
                  {centerCards.map((card, index) => (
                     <div key={index} className="p-2 border rounded">
                        {card.rank} of {card.suit}
                     </div>
                  ))}
               </div>
            </div>
            <div className="mb-4">
               <h2 className="font-bold">Log</h2>
               <ul>
                  {log.map((entry, index) => (
                     <li key={index}>{entry}</li>
                  ))}
               </ul>
            </div>

            {gameOver && playerHand.length === 0 && botHand.length === 0 && (
               <div className="flex flex-col items-center">
                  <h2 className="text-red-500 font-bold">
                     Game Over!{" "}
                     {playerScore > botScore ? "Player Wins!" : "Bot Wins!"}
                  </h2>
                  <button
                     onClick={resetGame}
                     className="mt-2 p-2 bg-green-500 text-white rounded "
                  >
                     Restart Game
                  </button>
               </div>
            )}
         </div>
      </div>
   );
}
