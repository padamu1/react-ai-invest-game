import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GameContext } from "../context/GameContext";

function Home() {
  const { setNickname, setMoney, setTurn, setInvestments, setGameOver } = useContext(GameContext);
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  const handleEnter = () => {
    if (input.trim()) {
      setNickname(input);
      setMoney(1000000);
      setTurn(1);
      setInvestments([]);
      setGameOver(false);
      navigate("/game");
    }
  };

  return (
    <div>
      <h1>모의 투자 게임</h1>
      <input
        type="text"
        placeholder="닉네임을 입력하세요"
        value={input}
        onChange={e => setInput(e.target.value)}
      />
      <button onClick={handleEnter}>입장</button>
    </div>
  );
}

export default Home;