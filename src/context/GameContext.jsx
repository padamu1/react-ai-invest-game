import React, { createContext, useState } from "react";

export const GameContext = createContext();

export function GameProvider({ children }) {
  const [nickname, setNickname] = useState("");
  const [money, setMoney] = useState(1000000); // 시작 머니
  const [turn, setTurn] = useState(1);
  const [investments, setInvestments] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [result, setResult] = useState(null);

  return (
    <GameContext.Provider
      value={{
        nickname, setNickname,
        money, setMoney,
        turn, setTurn,
        investments, setInvestments,
        gameOver, setGameOver,
        result, setResult,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}